import {AppText, AppTextInput} from '../components/AppText';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ActivityIndicator, Alert, Linking, Modal, Pressable, ScrollView, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {api, uploadDocument, resolveDocumentUrl} from '../api/client';
import {colors} from '../theme/colors';
import DocumentPickerButton from '../components/DocumentPickerButton';
import ServiceHeader from '../components/ServiceHeader';

const idOf = value => String(value?._id ?? value?.id ?? value ?? '');
const listFrom = response => {
  const body = response?.data;
  const value = body?.data ?? body?.result ?? body?.items ?? body;
  return Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];
};
const money = value => Number(value || 0).toLocaleString('en-IN');
const saleDocs = [['idProof', 'ID Proof'], ['agreement', 'Sale Agreement']];

const emptyForm = () => ({
  carId: '',
  buyerId: '',
  customerSearch: '',
  newCustomer: false,
  customerName: '',
  customerMobile: '',
  customerCity: '',
  sellingPrice: '',
  sellingExpenses: '0',
  files: {},
  customDocs: [],
  customName: ''
});

export default function CarSaleScreen({navigation}) {
  const {top} = useSafeAreaInsets();
  const [cars, setCars] = useState([]);
  const [soldCars, setSoldCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [busy, setBusy] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewCar, setViewCar] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editForm, setEditForm] = useState({buyerId: '', sellingPrice: '', sellingExpenses: '0', saleDate: '', notes: ''});
  const [editFiles, setEditFiles] = useState({});
  const [actionBusy, setActionBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const set = (key, value) => setForm(previous => ({...previous, [key]: value}));
  const load = useCallback(async () => {
    setBusy(true);
    setLoadError('');
    try {
      const results = await Promise.allSettled([api.get('/cars'), api.get('/customers')]);
      if (results[0].status !== 'fulfilled') {
        throw results[0].reason;
      }
      const allCars = listFrom(results[0].value);
      // A sale record is the source of truth too: older failed requests may have
      // created the sale row before the car status was updated.
      setCars(allCars.filter(car =>
        String(car.status || 'AVAILABLE').toUpperCase() !== 'SOLD' && !car.sale && !car.saleDetails
      ));
      setSoldCars(allCars.filter(car =>
        String(car.status || '').toUpperCase() === 'SOLD' || Boolean(car.sale || car.saleDetails)
      ));
      setCustomers(results[1].status === 'fulfilled' ? listFrom(results[1].value) : []);
      if (results[1].status === 'rejected') {
        setLoadError('Vehicles loaded, but customer records could not be loaded. Please refresh and try again.');
      }
    } catch (error) {
      setCars([]);
      setSoldCars([]);
      setCustomers([]);
      setLoadError(error?.response?.data?.message || error?.message || 'Unable to load car sales.');
    } finally {
      setBusy(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  const openSale = () => {
    setForm(emptyForm());
    setModal(true);
  };

  const openEditSale = car => {
    const sale = car.sale || car.saleDetails || {};
    setEditingCar(car);
    setEditFiles({});
    setEditForm({
      buyerId: idOf(sale.buyerId || sale.buyer || ''),
      sellingPrice: String(sale.sellingPrice ?? car.sellingPrice ?? car.salePrice ?? ''),
      sellingExpenses: String(sale.sellingExpenses ?? '0'),
      saleDate: sale.saleDate ? String(sale.saleDate).slice(0, 10) : '',
      notes: String(sale.notes || '')
    });
    setEditModal(true);
  };

  async function saveSaleEdit() {
    if (!editingCar) return;
    const price = Number(editForm.sellingPrice);
    const expenses = Number(editForm.sellingExpenses || 0);
    if (!editForm.buyerId) {
      Alert.alert('Select a Customer', 'Choose the buyer for this sale.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert('Invalid Selling Price', 'Enter a selling price greater than zero.');
      return;
    }
    if (!Number.isFinite(expenses) || expenses < 0) {
      Alert.alert('Invalid Expenses', 'Enter zero or a positive number for selling expenses.');
      return;
    }
    setActionBusy(true);
    try {
      const carId = encodeURIComponent(idOf(editingCar));
      await api.patch('/cars/' + carId + '/sale', {
        buyerId: editForm.buyerId,
        sellingPrice: price,
        sellingExpenses: expenses,
        ...(editForm.saleDate ? {saleDate: editForm.saleDate} : {}),
        notes: editForm.notes
      });

      // Upload replacement files selected in Edit Sale after saving the sale details.
      for (const [key] of saleDocs) {
        if (!editFiles[key]) continue;
        await uploadDocument('/cars/' + carId + '/sale/documents/' + key, editFiles[key]);
      }
      for (const [key, file] of Object.entries(editFiles)) {
        if (!key.startsWith('custom:') || !file) continue;
        await uploadDocument('/cars/' + carId + '/sale/documents/custom', file, {documentName: key.slice('custom:'.length)});
      }
      setEditModal(false);
      setEditFiles({});
      setEditingCar(null);
      await load();
      Alert.alert('Sale Updated Successfully', 'The completed sale details have been updated.');
    } catch (error) {
      Alert.alert('Unable to Update Sale', error?.response?.data?.message || error?.message || 'Please try again.');
    } finally {
      setActionBusy(false);
    }
  }

  const deleteSale = car => {
    Alert.alert(
      'Delete Completed Sale?',
      'This will remove the sale record and restore the vehicle to Available Inventory. The vehicle itself will not be deleted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete Sale',
          style: 'destructive',
          onPress: async () => {
            setActionBusy(true);
            try {
              await api.delete('/cars/' + encodeURIComponent(idOf(car)) + '/sale');
              if (viewCar && idOf(viewCar) === idOf(car)) setViewCar(null);
              await load();
              Alert.alert('Sale Deleted', 'The vehicle has been restored to Available Inventory.');
            } catch (error) {
              Alert.alert('Unable to Delete Sale', error?.response?.data?.message || error?.message || 'Please try again.');
            } finally {
              setActionBusy(false);
            }
          }
        }
      ]
    );
  };

  const addCustomDocument = () => {
    const name = form.customName.trim();
    if (!name) {
      Alert.alert('Document Name Required', 'Enter a name for the document first.');
      return;
    }
    if (form.customDocs.some(item => item.toLowerCase() === name.toLowerCase())) {
      Alert.alert('Document Already Added', 'Choose a different document name.');
      return;
    }
    setForm(previous => ({...previous, customDocs: [...previous.customDocs, name], customName: ''}));
  };

  const removeCustomDocument = name => {
    setForm(previous => {
      const files = {...previous.files};
      delete files['custom:' + name];
      return {...previous, customDocs: previous.customDocs.filter(item => item !== name), files};
    });
  };

  async function sell() {
    const selectedCar = cars.find(car => idOf(car) === form.carId);
    const selectedCustomer = customers.find(customer => idOf(customer) === form.buyerId);
    const price = Number(form.sellingPrice);
    const expenses = Number(form.sellingExpenses || 0);

    if (!selectedCar) {
      Alert.alert('Select a Vehicle', 'Choose an available vehicle before completing the sale.');
      return;
    }
    if (!form.newCustomer && !selectedCustomer) {
      Alert.alert('Select a Customer', 'Choose an existing customer or create a new customer.');
      return;
    }
    if (form.newCustomer && (!form.customerName.trim() || !form.customerMobile.trim())) {
      Alert.alert('Customer Details Required', 'Customer name and mobile number are required.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert('Invalid Selling Price', 'Enter a selling price greater than zero.');
      return;
    }
    if (!Number.isFinite(expenses) || expenses < 0) {
      Alert.alert('Invalid Expenses', 'Enter zero or a positive number for selling expenses.');
      return;
    }

    setSaving(true);
    try {
      let buyerId = form.buyerId;
      if (form.newCustomer) {
        const response = await api.post('/customers', {
          name: form.customerName.trim(),
          mobile: form.customerMobile.trim(),
          city: form.customerCity.trim()
        });
        const createdCustomer = response?.data?.data ?? response?.data?.result ?? response?.data?.customer ?? response?.data;
        buyerId = idOf(createdCustomer);
        if (!buyerId || buyerId === '[object Object]') {
          throw new Error('Customer was created, but the server did not return a valid customer ID. Refresh customers and try again.');
        }
      }

      const carId = idOf(selectedCar);
      const response = await api.post('/cars/' + encodeURIComponent(carId) + '/sell', {
        buyerId,
        sellingPrice: price,
        sellingExpenses: expenses,
        documents: {
          idProof: Boolean(form.files.idProof),
          agreement: Boolean(form.files.agreement),
          customDocuments: form.customDocs
        }
      });

      const uploadErrors = [];
      for (const [key, label] of saleDocs) {
        if (!form.files[key]) continue;
        try {
          await uploadDocument('/cars/' + encodeURIComponent(carId) + '/sale/documents/' + key, form.files[key]);
        } catch (error) {
          uploadErrors.push(label + ': ' + (error?.response?.data?.message || error?.message || 'Upload failed'));
        }
      }
      for (const name of form.customDocs) {
        const file = form.files['custom:' + name];
        if (!file) continue;
        try {
          await uploadDocument('/cars/' + encodeURIComponent(carId) + '/sale/documents/custom', file, {documentName: name});
        } catch (error) {
          uploadErrors.push(name + ': ' + (error?.response?.data?.message || error?.message || 'Upload failed'));
        }
      }

      const result = response?.data?.data ?? response?.data?.result ?? response?.data;
      setModal(false);
      await load();
      const profit = result?.profit ?? result?.netProfit;
      Alert.alert(
        uploadErrors.length ? 'Sale Saved Successfully' : 'Car Sale Completed Successfully',
        (uploadErrors.length
          ? 'The vehicle sale was saved, but these documents could not be uploaded:\n\n' + uploadErrors.join('\n')
          : 'The vehicle has been marked as sold successfully.') +
          (profit !== undefined && profit !== null ? '\n\nNet profit: ₹' + money(profit) : '')
      );
    } catch (error) {
      Alert.alert(
        'Unable to Complete Sale',
        error?.response?.data?.message || error?.message || 'The sale could not be completed. Please verify the details and try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  const query = form.customerSearch.trim().toLowerCase();
  const visibleCustomers = customers.filter(customer => {
    const haystack = [
      customer.customerId, customer.name, customer.mobile, customer.city
    ].map(value => String(value || '')).join(' ').toLowerCase();
    return !query || haystack.includes(query);
  });
  const chosenCar = cars.find(car => idOf(car) === form.carId);
  const netValue = Math.max(0, Number(form.sellingPrice || 0) - Number(form.sellingExpenses || 0));

  return (
    <View style={[s.page, {paddingTop: top + 12}]}>
      <ServiceHeader
        title="Car Sale"
        subtitle="Record vehicle sales and track completed transactions."
        navigation={navigation}
        kicker="SM ASSOCIATE / AUTOMOTIVE"
        actionLabel="Sell Car"
        actionIcon="car-outline"
        onAction={openSale}
        actionInline
      />

      {busy ? (
        <ActivityIndicator style={{marginTop: 45}} color={colors.gold} size="large" />
      ) : (
        <ScrollView contentContainerStyle={s.list}>
          {loadError ? (
            <View style={s.errorCard}>
              <Ionicons name="alert-circle-outline" size={23} color={colors.danger || '#B45309'} />
              <AppText style={s.errorText}>{loadError}</AppText>
              <Pressable onPress={load} style={s.refreshButton}><AppText style={s.refreshText}>Retry</AppText></Pressable>
            </View>
          ) : null}

          <View style={s.summaryRow}>
            <View style={s.summary}>
              <AppText style={s.summaryNumber}>{cars.length}</AppText>
              <AppText style={s.summaryLabel}>Available Vehicles</AppText>
            </View>
            <View style={s.summary}>
              <AppText style={s.summaryNumber}>{soldCars.length}</AppText>
              <AppText style={s.summaryLabel}>Vehicles Sold</AppText>
            </View>
          </View>

          <View style={s.sectionHeader}>
            <AppText style={s.sectionLabel}>AVAILABLE INVENTORY</AppText>
            <Pressable onPress={load} style={s.iconButton} accessibilityLabel="Refresh vehicle list">
              <Ionicons name="refresh-outline" size={18} color={colors.teal} />
            </Pressable>
          </View>
          {cars.length ? cars.map(car => (
            <Pressable key={idOf(car)} onPress={() => setViewCar(car)} style={({pressed}) => [s.carCard, pressed && s.pressed]}>
              <View style={s.carIcon}><Ionicons name="car-sport-outline" size={22} color={colors.teal} /></View>
              <View style={{flex: 1}}>
                <AppText style={s.cardTitle}>{car.vehicleId || car.id || 'Vehicle'} · {[car.make, car.model].filter(Boolean).join(' ')}</AppText>
                <AppText style={s.muted}>{car.registrationNumber || 'No registration'} · {car.year || '—'} · {car.fuel || '—'}</AppText>
                <AppText style={s.priceText}>Purchase ₹{money(car.purchasePrice)}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          )) : <Empty icon="car-outline" title="No available vehicles" text="Add a vehicle in Car Inventory before recording a sale." />}

          <AppText style={s.sectionLabel}>COMPLETED SALES</AppText>
          {soldCars.length ? soldCars.map((car,index) => {
            const sale = car.sale || car.saleDetails || {};
            const buyer = sale.buyer || (sale.buyerId && typeof sale.buyerId === 'object' ? sale.buyerId : null);
            const buyerName = buyer?.name || 'Buyer not set';
            const vehicleName = [car.make, car.model].filter(Boolean).join(' ') || 'Vehicle';
            const saleDate = sale.saleDate ? String(sale.saleDate).slice(0, 10) : '';
            const sellingPrice = sale.sellingPrice ?? car.sellingPrice ?? car.salePrice;
            return (
              <Pressable
                key={idOf(car) || String(index)}
                onPress={() => setViewCar(car)}
                style={({pressed}) => [{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 11,
                  borderWidth: 1,
                  borderColor: '#E4E8E7',
                  opacity: pressed ? 0.82 : 1
                }]}
                accessibilityRole="button"
                accessibilityLabel={'View completed sale for ' + vehicleName}
              >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10}}>
                  <View style={{flex: 1}}>
                    <AppText style={{fontSize: 15, color: colors.ink}}>{buyerName}</AppText>
                    <AppText style={{fontSize: 12, color: colors.muted, marginTop: 4}}>
                      {(car.vehicleId || car.id || 'Vehicle') + ' · ' + vehicleName}
                    </AppText>
                  </View>
                  <View style={{backgroundColor: '#E2F4EC', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9, alignSelf: 'flex-start'}}>
                    <AppText style={{fontSize: 10, color: colors.ink}}>SOLD</AppText>
                  </View>
                </View>
                {sale.notes ? (
                  <AppText style={{fontSize: 12, color: colors.muted, marginTop: 7}} numberOfLines={2}>
                    {sale.notes}
                  </AppText>
                ) : null}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 10}}>
                  <AppText style={{fontSize: 11, color: colors.teal, flex: 1}}>Tap to view or update →</AppText>
                  <AppText style={{fontSize: 14, color: colors.ink, fontWeight: '700'}}>₹{money(sellingPrice)}</AppText>
                </View>
              </Pressable>
            );
          }) : <Empty icon="receipt-outline" title="No completed sales" text="Successfully recorded vehicle sales will appear here." />}
        </ScrollView>
      )}

      <Modal visible={Boolean(viewCar)} animationType="slide" transparent onRequestClose={() => setViewCar(null)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHead}>
              <View><AppText style={s.modalTitle}>Vehicle Details</AppText><AppText style={s.modalSub}>{viewCar?.status || 'Vehicle'}</AppText></View>
              <Pressable onPress={() => setViewCar(null)} style={s.closeButton}><Ionicons name="close" size={22} color={colors.ink} /></Pressable>
            </View>
            {viewCar ? (
              <ScrollView contentContainerStyle={s.form}>
                {[
                  ['Vehicle ID', viewCar.vehicleId ?? viewCar.id],
                  ['Vehicle', [viewCar.make, viewCar.model].filter(Boolean).join(' ')],
                  ['Registration', viewCar.registrationNumber],
                  ['Sale Date', (viewCar.sale || viewCar.saleDetails)?.saleDate ? String((viewCar.sale || viewCar.saleDetails).saleDate).slice(0, 10) : '—'],
                  ['Year', viewCar.year],
                  ['Fuel', viewCar.fuel],
                  ['Purchase Price', '₹' + money(viewCar.purchasePrice)],
                  ['Selling Price', '₹' + money(viewCar.sale?.sellingPrice ?? viewCar.sellingPrice ?? viewCar.salePrice)],
                  ['Status', viewCar.status]
                ].map(([label, value]) => (
                  <View key={label} style={s.detailRow}>
                    <AppText style={s.detailLabel}>{label}</AppText>
                    <AppText style={s.detailValue}>{String(value || '—')}</AppText>
                  </View>
                ))}
                <AppText style={s.formSection}>SALE DOCUMENTS</AppText>
                {saleDocs.map(([key, label]) => {
                  const uploaded = viewCar.saleDocuments?.uploads?.[key] || viewCar.sale?.documents?.uploads?.[key];
                  return (
                    <View key={key} style={s.doc}>
                      <AppText style={s.cardTitle}>{label}</AppText>
                      {uploaded?.originalName ? <AppText style={s.muted}>{uploaded.originalName}</AppText> : <AppText style={s.muted}>No document uploaded</AppText>}
                      {uploaded?.url ? <Pressable onPress={() => Linking.openURL(resolveDocumentUrl(uploaded.url))} style={s.openDoc}><AppText style={s.openDocText}>Open document</AppText></Pressable> : null}
                    </View>
                  );
                })}
                {String(viewCar.status || '').toUpperCase() === 'SOLD' || viewCar.sale || viewCar.saleDetails ? (
                  <View style={s.viewSaleActions}>
                    <Pressable disabled={actionBusy} onPress={() => { const carToEdit = viewCar; setViewCar(null); openEditSale(carToEdit); }} style={[s.viewEditAction, actionBusy && s.disabled]} accessibilityRole="button" accessibilityLabel="Edit completed sale">
                      <AppText style={s.viewEditText}>Edit Sale</AppText>
                    </Pressable>
                    <Pressable disabled={actionBusy} onPress={() => deleteSale(viewCar)} style={[s.viewDeleteAction, actionBusy && s.disabled]} accessibilityRole="button" accessibilityLabel="Delete completed sale">
                      <AppText style={s.viewDeleteText}>Delete Sale</AppText>
                    </Pressable>
                  </View>
                ) : null}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal visible={editModal} animationType="slide" transparent onRequestClose={() => !actionBusy && setEditModal(false)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHead}>
              <View>
                <AppText style={s.modalTitle}>Edit Completed Sale</AppText>
                <AppText style={s.modalSub}>{editingCar ? [editingCar.make, editingCar.model].filter(Boolean).join(' ') : 'Update sale details'}</AppText>
              </View>
              <Pressable disabled={actionBusy} onPress={() => setEditModal(false)} style={s.closeButton}><Ionicons name="close" size={22} color={colors.ink} /></Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.form}>
              <AppText style={s.formSection}>BUYER</AppText>
              {customers.map(customer => (
                <Pressable key={idOf(customer)} onPress={() => setEditForm(previous => ({...previous, buyerId: idOf(customer)}))} style={[s.option, editForm.buyerId === idOf(customer) && s.active]}>
                  <View style={s.avatar}><AppText style={s.avatarText}>{String(customer.name || '?').slice(0, 1).toUpperCase()}</AppText></View>
                  <View style={{flex: 1}}>
                    <AppText style={s.cardTitle}>{customer.customerId || ''}{customer.customerId ? ' · ' : ''}{customer.name || 'Unnamed customer'}</AppText>
                    <AppText style={s.muted}>{customer.mobile || 'No mobile'}{customer.city ? ' · ' + customer.city : ''}</AppText>
                  </View>
                  <Ionicons name={editForm.buyerId === idOf(customer) ? 'checkmark-circle' : 'ellipse-outline'} size={21} color={editForm.buyerId === idOf(customer) ? colors.teal : colors.muted} />
                </Pressable>
              ))}
              <AppText style={s.formSection}>SALE DETAILS</AppText>
              <Field label="Selling Price (₹)" value={editForm.sellingPrice} onChangeText={value => setEditForm(previous => ({...previous, sellingPrice: value.replace(/[^0-9.]/g, '')}))} keyboardType="decimal-pad" />
              <Field label="Selling Expenses (₹)" value={editForm.sellingExpenses} onChangeText={value => setEditForm(previous => ({...previous, sellingExpenses: value.replace(/[^0-9.]/g, '')}))} keyboardType="decimal-pad" />
              <Field label="Sale Date (YYYY-MM-DD, optional)" value={editForm.saleDate} onChangeText={value => setEditForm(previous => ({...previous, saleDate: value}))} />
              <Field label="Notes (optional)" value={editForm.notes} onChangeText={value => setEditForm(previous => ({...previous, notes: value}))} />

              <AppText style={s.formSection}>SALE DOCUMENTS</AppText>
              <AppText style={s.documentHint}>Existing files are shown below. Choose Replace to upload a new version, or leave the file unchanged.</AppText>
              {saleDocs.map(([key, label]) => {
                const sale = editingCar?.sale || editingCar?.saleDetails || {};
                const uploaded = sale.documents?.uploads?.[key] || editingCar?.saleDocuments?.uploads?.[key] || sale.documents?.[key];
                return (
                  <View key={key} style={s.doc}>
                    <AppText style={s.cardTitle}>{label}</AppText>
                    {uploaded?.url ? (
                      <Pressable onPress={() => Linking.openURL(resolveDocumentUrl(uploaded.url))} style={s.openDoc}>
                        <AppText style={s.openDocText}>View current document</AppText>
                      </Pressable>
                    ) : (
                      <AppText style={s.muted}>No document uploaded yet</AppText>
                    )}
                    {uploaded?.originalName ? <AppText style={s.fileMeta} numberOfLines={1}>Current file: {uploaded.originalName}</AppText> : null}
                    <DocumentPickerButton
                      label={uploaded?.url ? 'Replace document' : 'Upload document'}
                      file={editFiles[key]}
                      uploaded={uploaded}
                      onPick={file => setEditFiles(previous => ({...previous, [key]: file}))}
                    />
                  </View>
                );
              })}
              {((editingCar?.sale || editingCar?.saleDetails || {}).documents?.customUploads || []).map(doc => {
                const key = 'custom:' + doc.name;
                return (
                  <View key={key} style={s.doc}>
                    <AppText style={s.cardTitle}>{doc.name || 'Custom document'}</AppText>
                    {doc.url ? (
                      <Pressable onPress={() => Linking.openURL(resolveDocumentUrl(doc.url))} style={s.openDoc}>
                        <AppText style={s.openDocText}>View current document</AppText>
                      </Pressable>
                    ) : <AppText style={s.muted}>No document uploaded yet</AppText>}
                    {doc.originalName ? <AppText style={s.fileMeta} numberOfLines={1}>Current file: {doc.originalName}</AppText> : null}
                    <DocumentPickerButton
                      label="Replace document"
                      file={editFiles[key]}
                      uploaded={doc}
                      onPick={file => setEditFiles(previous => ({...previous, [key]: file}))}
                    />
                  </View>
                );
              })}
              <View style={s.net}>
                <View><AppText style={s.netLabel}>ESTIMATED NET SALE VALUE</AppText><AppText style={s.netHint}>Selling price minus selling expenses</AppText></View>
                <AppText style={s.netValue}>₹{money(Math.max(0, Number(editForm.sellingPrice || 0) - Number(editForm.sellingExpenses || 0)))}</AppText>
              </View>
              <Pressable disabled={actionBusy} onPress={saveSaleEdit} style={[s.primary, actionBusy && s.disabled]}>
                {actionBusy ? <ActivityIndicator color={colors.midnight} /> : <Ionicons name="save-outline" size={20} color={colors.midnight} />}
                <AppText style={s.primaryText}>{actionBusy ? 'Saving Changes…' : 'Save Changes'}</AppText>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => !saving && setModal(false)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHead}>
              <View><AppText style={s.modalTitle}>Record Car Sale</AppText><AppText style={s.modalSub}>Choose a vehicle and buyer, then confirm the amount.</AppText></View>
              <Pressable disabled={saving} onPress={() => setModal(false)} style={s.closeButton}><Ionicons name="close" size={22} color={colors.ink} /></Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.form}>
              <AppText style={s.formSection}>1. SELECT VEHICLE</AppText>
              {cars.length ? cars.map(car => (
                <Pressable key={idOf(car)} onPress={() => set('carId', idOf(car))} style={[s.option, form.carId === idOf(car) && s.active]}>
                  <View style={s.carIcon}><Ionicons name="car-sport-outline" size={20} color={colors.teal} /></View>
                  <View style={{flex: 1}}>
                    <AppText style={s.cardTitle}>{car.vehicleId || car.id || 'Vehicle'} · {[car.make, car.model].filter(Boolean).join(' ')}</AppText>
                    <AppText style={s.muted}>{car.registrationNumber || 'No registration'} · Purchase ₹{money(car.purchasePrice)}</AppText>
                  </View>
                  <Ionicons name={form.carId === idOf(car) ? 'checkmark-circle' : 'ellipse-outline'} size={21} color={form.carId === idOf(car) ? colors.teal : colors.muted} />
                </Pressable>
              )) : <Empty icon="car-outline" title="No vehicles to sell" text="Add an available vehicle to inventory first." />}

              {chosenCar ? (
                <View style={s.selectedCard}>
                  <AppText style={s.selectedLabel}>SELECTED VEHICLE</AppText>
                  <AppText style={s.selectedName}>{chosenCar.make} {chosenCar.model}</AppText>
                  <AppText style={s.muted}>{chosenCar.registrationNumber || chosenCar.vehicleId || ''}</AppText>
                </View>
              ) : null}

              <AppText style={s.formSection}>2. CUSTOMER / BUYER</AppText>
              <Pressable onPress={() => setForm(previous => ({...previous, newCustomer: !previous.newCustomer, buyerId: '', customerSearch: ''}))} style={s.newCustomerButton}>
                <Ionicons name={form.newCustomer ? 'people-outline' : 'person-add-outline'} size={18} color={colors.midnight} />
                <AppText style={s.newCustomerText}>{form.newCustomer ? 'Choose Existing Customer' : 'Create New Customer'}</AppText>
              </Pressable>

              {form.newCustomer ? (
                <View style={s.customerForm}>
                  <Field label="Customer Name" value={form.customerName} onChangeText={value => set('customerName', value)} />
                  <Field label="Mobile Number" value={form.customerMobile} onChangeText={value => set('customerMobile', value)} keyboardType="phone-pad" />
                  <Field label="City (optional)" value={form.customerCity} onChangeText={value => set('customerCity', value)} />
                </View>
              ) : (
                <>
                  <View style={s.searchBox}>
                    <Ionicons name="search-outline" size={19} color={colors.teal} />
                    <AppTextInput value={form.customerSearch} onChangeText={value => set('customerSearch', value)} placeholder="Search customer name, ID or mobile" placeholderTextColor="#89959C" style={s.searchInput} />
                    {form.customerSearch ? <Pressable onPress={() => set('customerSearch', '')}><Ionicons name="close-circle" size={19} color={colors.muted} /></Pressable> : null}
                  </View>
                  {visibleCustomers.length ? visibleCustomers.map(customer => (
                    <Pressable key={idOf(customer)} onPress={() => set('buyerId', idOf(customer))} style={[s.option, form.buyerId === idOf(customer) && s.active]}>
                      <View style={s.avatar}><AppText style={s.avatarText}>{String(customer.name || '?').slice(0, 1).toUpperCase()}</AppText></View>
                      <View style={{flex: 1}}>
                        <AppText style={s.cardTitle}>{customer.customerId || ''}{customer.customerId ? ' · ' : ''}{customer.name || 'Unnamed customer'}</AppText>
                        <AppText style={s.muted}>{customer.mobile || 'No mobile'}{customer.city ? ' · ' + customer.city : ''}</AppText>
                      </View>
                      <Ionicons name={form.buyerId === idOf(customer) ? 'checkmark-circle' : 'ellipse-outline'} size={21} color={form.buyerId === idOf(customer) ? colors.teal : colors.muted} />
                    </Pressable>
                  )) : <Empty icon="person-outline" title="No matching customers" text="Try a different search or create a new customer." />}
                </>
              )}

              <AppText style={s.formSection}>3. SALE AMOUNT</AppText>
              <Field label="Selling Price (₹)" value={form.sellingPrice} onChangeText={value => set('sellingPrice', value.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" />
              <Field label="Selling Expenses (₹)" value={form.sellingExpenses} onChangeText={value => set('sellingExpenses', value.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" />
              <View style={s.net}>
                <View><AppText style={s.netLabel}>ESTIMATED NET SALE VALUE</AppText><AppText style={s.netHint}>Selling price minus selling expenses</AppText></View>
                <AppText style={s.netValue}>₹{money(netValue)}</AppText>
              </View>

              <AppText style={s.formSection}>4. DOCUMENTS (OPTIONAL)</AppText>
              {saleDocs.map(([key, label]) => (
                <View key={key} style={s.doc}>
                  <AppText style={s.cardTitle}>{label}</AppText>
                  <DocumentPickerButton file={form.files[key]} onPick={file => setForm(previous => ({...previous, files: {...previous.files, [key]: file}}))} />
                </View>
              ))}
              {form.customDocs.map(name => (
                <View key={name} style={s.doc}>
                  <View style={s.docHeader}><AppText style={s.cardTitle}>{name}</AppText><Pressable onPress={() => removeCustomDocument(name)}><AppText style={s.removeText}>Remove</AppText></Pressable></View>
                  <DocumentPickerButton file={form.files['custom:' + name]} onPick={file => setForm(previous => ({...previous, files: {...previous.files, ['custom:' + name]: file}}))} />
                </View>
              ))}
              <View style={s.customRow}>
                <AppTextInput value={form.customName} onChangeText={value => set('customName', value)} placeholder="Custom document name" placeholderTextColor="#89959C" style={[s.input, {flex: 1}]} />
                <Pressable onPress={addCustomDocument} style={s.addButton}><AppText style={s.addText}>Add</AppText></Pressable>
              </View>

              <Pressable disabled={saving || !form.carId} onPress={sell} style={[s.primary, (saving || !form.carId) && s.disabled]}>
                {saving ? <ActivityIndicator color={colors.midnight} /> : <Ionicons name="checkmark-circle-outline" size={20} color={colors.midnight} />}
                <AppText style={s.primaryText}>{saving ? 'Saving Sale…' : 'Complete Car Sale'}</AppText>
              </Pressable>
              <AppText style={s.footerNote}>The vehicle is marked as sold only after the server confirms the sale.</AppText>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Empty({icon, title, text}) {
  return <View style={s.empty}><Ionicons name={icon} size={27} color={colors.muted} /><AppText style={s.emptyTitle}>{title}</AppText><AppText style={s.emptyText}>{text}</AppText></View>;
}

function Field({label, value, onChangeText, keyboardType = 'default'}) {
  return <View style={s.fieldWrap}><AppText style={s.label}>{label}</AppText><AppTextInput value={String(value ?? '')} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={'Enter ' + label.toLowerCase()} placeholderTextColor="#89959C" style={s.input} /></View>;
}

const s = {
  page: {flex: 1, backgroundColor: '#F4F6F3'},
  list: {padding: 18, paddingBottom: 120},
  pressed: {opacity: 0.8},
  summaryRow: {flexDirection: 'row', gap: 10, marginBottom: 12},
  summary: {flex: 1, backgroundColor: colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(39,168,154,.14)'},
  summaryNumber: {fontSize: 26, color: colors.ink, fontWeight: '700'},
  summaryLabel: {fontSize: 10, color: colors.muted, marginTop: 4},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  sectionLabel: {fontSize: 11, letterSpacing: 1, color: colors.ink, marginTop: 18, marginBottom: 9, fontWeight: '700'},
  iconButton: {width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: 'rgba(39,168,154,.15)'},
  carCard: {backgroundColor: colors.white, borderRadius: 20, padding: 14, marginBottom: 9, borderWidth: 1, borderColor: 'rgba(39,168,154,.13)', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
  saleCard: {flexDirection: 'column', alignItems: 'stretch'},
  saleTopRow: {flexDirection: 'row', alignItems: 'flex-start', width: '100%', gap: 8},
  saleInfo: {flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0},
  viewSaleActions: {flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 8},
  viewEditAction: {flex: 1, height: 48, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(39,168,154,0.20)', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white},
  viewEditText: {color: colors.midnight, fontSize: 13, fontWeight: '600'},
  viewDeleteAction: {flex: 1, height: 48, borderRadius: 13, backgroundColor: '#FFF2F2', borderWidth: 1, borderColor: '#E8CACA', alignItems: 'center', justifyContent: 'center'},
  viewDeleteText: {color: colors.danger, fontSize: 13, fontWeight: '600'},
  carIcon: {width: 44, height: 44, borderRadius: 14, backgroundColor: colors.goldLight, alignItems: 'center', justifyContent: 'center', marginRight: 11},
  soldIcon: {width: 44, height: 44, borderRadius: 14, backgroundColor: '#EAF6F1', alignItems: 'center', justifyContent: 'center', marginRight: 11},
  cardTitle: {fontSize: 14, color: colors.ink, fontWeight: '600'},
  muted: {fontSize: 11, color: colors.muted, marginTop: 4},
  priceText: {fontSize: 11, color: colors.teal, marginTop: 5, fontWeight: '600'},
  soldBadge: {paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9, backgroundColor: colors.goldLight},
  soldBadgeText: {fontSize: 9, color: colors.teal, fontWeight: '700'},
  empty: {backgroundColor: colors.white, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(39,168,154,.12)', marginBottom: 8},
  emptyTitle: {fontSize: 14, color: colors.ink, marginTop: 8, fontWeight: '600'},
  emptyText: {fontSize: 11, color: colors.muted, marginTop: 5, textAlign: 'center', lineHeight: 17},
  errorCard: {backgroundColor: '#FFF7ED', borderRadius: 16, padding: 14, marginBottom: 12, gap: 8, borderWidth: 1, borderColor: '#FED7AA'},
  errorText: {fontSize: 12, color: '#9A3412', lineHeight: 18},
  refreshButton: {alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.midnight},
  refreshText: {fontSize: 11, color: colors.goldLight, fontWeight: '700'},
  overlay: {flex: 1, backgroundColor: 'rgba(7,13,18,.70)', justifyContent: 'flex-end'},
  modal: {backgroundColor: '#FAFCFA', maxHeight: '94%', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 19, borderWidth: 1, borderColor: 'rgba(39,168,154,.18)', shadowColor: '#000', shadowOffset: {width: 0, height: 18}, shadowOpacity: 0.22, shadowRadius: 28, elevation: 18},
  modalHead: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 10},
  modalTitle: {fontSize: 22, color: colors.midnight, fontWeight: '700'},
  modalSub: {fontSize: 11, color: colors.muted, marginTop: 4, lineHeight: 16},
  closeButton: {width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white},
  form: {paddingBottom: 28},
  formSection: {fontSize: 11, letterSpacing: 0.8, color: colors.ink, marginTop: 15, marginBottom: 9, fontWeight: '700'},
  documentHint: {fontSize: 11, color: colors.muted, lineHeight: 17, marginBottom: 8},
  fileMeta: {fontSize: 10, color: colors.muted, marginTop: 5},
  option: {backgroundColor: colors.white, borderRadius: 16, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(39,168,154,.13)', flexDirection: 'row', alignItems: 'center'},
  active: {borderColor: colors.gold, backgroundColor: '#FFF9E8'},
  avatar: {width: 42, height: 42, borderRadius: 14, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', marginRight: 11},
  avatarText: {color: colors.goldLight, fontSize: 16, fontWeight: '700'},
  selectedCard: {backgroundColor: colors.white, borderRadius: 16, padding: 13, marginTop: 4, borderWidth: 1, borderColor: 'rgba(39,168,154,.15)'},
  selectedLabel: {fontSize: 9, letterSpacing: 1, color: colors.teal, fontWeight: '700'},
  selectedName: {fontSize: 15, color: colors.ink, marginTop: 4, fontWeight: '600'},
  newCustomerButton: {minHeight: 46, borderRadius: 14, backgroundColor: colors.gold, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 10, paddingHorizontal: 12},
  newCustomerText: {color: colors.midnight, fontWeight: '700', fontSize: 12},
  customerForm: {backgroundColor: colors.white, borderRadius: 18, padding: 13, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(39,168,154,.15)'},
  searchBox: {height: 50, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(39,168,154,.25)', backgroundColor: colors.white, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9},
  searchInput: {flex: 1, height: 48, color: colors.ink, fontSize: 12, paddingHorizontal: 2},
  fieldWrap: {marginBottom: 11},
  label: {fontSize: 11, color: colors.ink, marginBottom: 6, fontWeight: '600'},
  input: {minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(39,168,154,.20)', backgroundColor: colors.white, paddingHorizontal: 12, color: colors.ink},
  net: {backgroundColor: colors.midnight, borderRadius: 17, padding: 14, marginTop: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10},
  netLabel: {fontSize: 9, color: 'rgba(255,255,255,.7)', fontWeight: '700'},
  netHint: {fontSize: 9, color: 'rgba(255,255,255,.55)', marginTop: 4},
  netValue: {fontSize: 18, color: colors.goldLight, fontWeight: '700'},
  doc: {backgroundColor: colors.white, borderRadius: 16, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(39,168,154,.13)'},
  docHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8},
  removeText: {fontSize: 11, color: '#B42318', fontWeight: '600'},
  customRow: {flexDirection: 'row', gap: 8, marginTop: 2, marginBottom: 8},
  addButton: {width: 64, borderRadius: 14, backgroundColor: colors.midnight, alignItems: 'center', justifyContent: 'center'},
  addText: {color: colors.goldLight, fontWeight: '700'},
  primary: {minHeight: 54, borderRadius: 17, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 12},
  primaryText: {color: colors.midnight, fontSize: 14, fontWeight: '700'},
  disabled: {opacity: 0.5},
  footerNote: {fontSize: 10, color: colors.muted, textAlign: 'center', marginTop: 12, lineHeight: 15},
  detailRow: {backgroundColor: colors.white, borderRadius: 14, padding: 13, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(39,168,154,.13)'},
  detailLabel: {fontSize: 10, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6},
  detailValue: {fontSize: 14, color: colors.ink, marginTop: 4},
  openDoc: {alignSelf: 'flex-start', marginTop: 8, paddingVertical: 7, paddingHorizontal: 10, backgroundColor: colors.goldLight, borderRadius: 9},
  openDocText: {fontSize: 11, color: colors.midnight, fontWeight: '700'}
};
