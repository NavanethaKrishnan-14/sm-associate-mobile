import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {useAuth} from '../context/AuthContext';

const groups = [
  {
    label: 'OPERATE',
    title: 'Daily Operations',
    items: [
      ['Car Sold', 'car-sport-outline', 'CarSale', 'Vehicle sales'],
      ['Vehicle Expenses', 'receipt-outline', 'Expenses', 'Cost tracking'],
      ['User Management', 'people-outline', 'Users', 'People & access'],
    ],
  },
  {
    label: 'INSIGHT',
    title: 'Money & Performance',
    items: [
      ['Car Profit', 'trending-up-outline', 'CarProfit', 'Profit overview'],
      ['Loan Revenue', 'cash-outline', 'LoanRevenue', 'Revenue overview'],
      ['Operational Reports', 'document-text-outline', 'OperationalReports', 'Business insights'],
    ],
  },
];

export default function MoreScreen({navigation}) {
  const {top, bottom} = useSafeAreaInsets();
  const {isAdmin,signOut}=useAuth();
  const adminOnly=new Set(['Car Sold','Vehicle Expenses','User Management','Car Profit','Loan Revenue','Operational Reports']);

  const go = (section) => {
    if (section === 'CarSale') {
      navigation.navigate('CarSale');
      return;
    }

    if (['CarProfit', 'LoanRevenue', 'OperationalReports'].includes(section)) {
      navigation.navigate(section);
      return;
    }

    navigation.navigate('AdminTools', {section});
  };

  const handleSignOut=async()=>{await signOut();};

  return (
    <View style={styles.page}>
      <ScrollView
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, {paddingBottom: bottom + 105}]}
      >
        <View style={[styles.header, {paddingTop: top + 14}]}>
          <View style={styles.headerTop}>
            <View style={styles.logo}>
              <Logo width={84} />
            </View>

            <View style={styles.headerCenter}>
              <Text style={styles.headerKicker}>SM ASSOCIATE</Text>
              <Text style={styles.headerTitle}>CONTROL ROOM</Text>
            </View>

            <View style={styles.headerCode}>
              <Text style={styles.headerCodeTop}>{isAdmin?'AD':'ST'}</Text>
              <Text style={styles.headerCodeBottom}>TOOLS</Text>
            </View>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.headerStatus}>
              <View style={styles.liveDot} />
              <Text style={styles.statusText}>OPERATIONS ACTIVE</Text>
            </View>
            <Text style={styles.headerDate}>BUSINESS / MANAGEMENT</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.hero}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroOverline}>MORE</Text>
              <Text style={styles.heroTitle}>Everything beyond the dashboard.</Text>
              <Text style={styles.heroSub}>
                Your control room for the decisions that keep SM Associate moving.
              </Text>
            </View>

            <View style={styles.heroMark}>
              <Ionicons name="arrow-down-outline" size={20} color={colors.teal} />
              <Text style={styles.heroMarkText}>EXPLORE</Text>
            </View>
          </View>

          {groups.map((group, groupIndex) => (
            <View key={group.label} style={styles.group}>
              <View style={styles.groupHead}>
                <View>
                  <Text style={styles.groupLabel}>{group.label}</Text>
                  <Text style={styles.groupTitle}>{group.title}</Text>
                </View>
                <Text style={styles.groupNumber}>0{groupIndex + 1}</Text>
              </View>

              <View style={styles.groupLine} />

              <View style={styles.actions}>
                {group.items.map((item, itemIndex) => {
                  const [label, icon, section, description] = item;
                  if(!isAdmin&&adminOnly.has(label)) return null;

                  return (
                    <Pressable
                      key={label}
                      onPress={() => go(section)}
                      style={({pressed}) => [
                        styles.action,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.actionNo}>
                        <Text style={styles.actionNoText}>
                          0{itemIndex + 1}
                        </Text>
                      </View>

                      <View style={styles.actionIcon}>
                        <Ionicons name={icon} size={21} color={colors.teal} />
                      </View>

                      <View style={styles.actionCopy}>
                        <Text style={styles.actionTitle}>{label}</Text>
                        <Text style={styles.actionDesc}>{description}</Text>
                      </View>

                      <View style={styles.actionArrow}>
                        <Ionicons
                          name="arrow-up-outline"
                          size={16}
                          color={colors.ink}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={styles.adminCard}>
            <View style={styles.adminTop}>
              <View style={styles.adminIcon}>
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={colors.teal}
                />
              </View>
              <Text style={styles.adminTag}>ADMIN AREA</Text>
            </View>

            <Text style={styles.adminTitle}>Protected workspace</Text>
            <Text style={styles.adminDesc}>
              {isAdmin?'Management controls are available according to your ADMIN permissions.':'Admin-only controls are hidden for your STAFF account.'}
            </Text>

            <View style={styles.adminRule} />

            <View style={styles.adminBottom}>
              <Text style={styles.adminBottomText}>ACCESS CONTROLLED</Text>
              <View style={styles.adminDot} />
            </View>
          </View>

          <Pressable
            onPress={handleSignOut}
            style={({pressed}) => [styles.logout, pressed && styles.pressed]}
          >
            <View style={styles.logoutLeft}>
              <View style={styles.logoutIcon}>
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={colors.danger}
                />
              </View>

              <View>
                <Text style={styles.logoutTitle}>Sign out</Text>
                <Text style={styles.logoutSub}>End current session</Text>
              </View>
            </View>

            <Ionicons name="arrow-forward" size={17} color={colors.danger} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: '#F2F3F1',
  },
  content: {
    paddingBottom: 110,
  },
  header: {
    backgroundColor: colors.midnight,
    paddingHorizontal: 18,
    paddingBottom: 15,
  },
  headerTop: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerKicker: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.teal,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: colors.white,
    marginTop: 3,
  },
  headerCode: {
    width: 48,
    height: 48,
    borderLeftWidth: 1,
    borderLeftColor: '#3A484E',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerCodeTop: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
    lineHeight: 19,
  },
  headerCodeBottom: {
    fontSize: 5.5,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: '#839095',
    marginTop: 2,
  },
  headerBottom: {
    height: 29,
    borderTopWidth: 1,
    borderTopColor: '#354149',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.success,
  },
  headerDate: {
    fontSize: 6.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#75848A',
  },
  body: {
    backgroundColor: '#F2F3F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 23,
    minHeight: 650,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 25,
  },
  heroLeft: {
    flex: 1,
  },
  heroOverline: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.teal,
  },
  heroTitle: {
    fontSize: 29,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: colors.ink,
    marginTop: 5,
    maxWidth: 320,
  },
  heroSub: {
    fontSize: 10.5,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 7,
    maxWidth: 315,
  },
  heroMark: {
    width: 57,
    height: 57,
    borderRadius: 18,
    backgroundColor: colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  heroMarkText: {
    fontSize: 5.5,
    fontWeight: '900',
    letterSpacing: 0.9,
    color: '#93A0A4',
    marginTop: 4,
  },
  group: {
    marginBottom: 27,
  },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  groupLabel: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.8,
    color: colors.teal,
  },
  groupTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 3,
  },
  groupNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D7DCDA',
  },
  groupLine: {
    height: 1,
    backgroundColor: '#D8DDDA',
    marginTop: 9,
    marginBottom: 7,
  },
  actions: {
    gap: 1,
  },
  action: {
    minHeight: 70,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E3',
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionNo: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNoText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#9AA5A9',
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#E2F1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  actionCopy: {
    flex: 1,
    minWidth: 0,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.ink,
  },
  actionDesc: {
    fontSize: 8.5,
    color: colors.muted,
    marginTop: 2,
  },
  actionArrow: {
    width: 31,
    height: 31,
    borderRadius: 11,
    backgroundColor: '#F0F2F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.78,
    transform: [{scale: 0.99}],
  },
  adminCard: {
    marginTop: -2,
    borderRadius: 23,
    backgroundColor: colors.midnight,
    padding: 16,
  },
  adminTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#24383B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTag: {
    fontSize: 6.5,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#8E9BA0',
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
    marginTop: 15,
  },
  adminDesc: {
    fontSize: 9.5,
    lineHeight: 15,
    color: '#AAB5B8',
    marginTop: 5,
    maxWidth: 300,
  },
  adminRule: {
    height: 1,
    backgroundColor: '#354149',
    marginTop: 16,
  },
  adminBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  adminBottomText: {
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: '#77858A',
  },
  adminDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  logout: {
    height: 57,
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: '#FFF9F9',
    borderWidth: 1,
    borderColor: '#E7CACA',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#FCEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: colors.danger,
  },
  logoutSub: {
    fontSize: 8,
    color: '#9B7C7C',
    marginTop: 2,
  },
};