import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
import Logo from '../components/Logo';
import {logout} from '../api/client';

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

  const signOut = async () => {
    await logout();
    navigation.replace('Login');
  };

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
              <Text style={styles.headerCodeTop}>06</Text>
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
            <View style={styles.heroOrb} />
            <View style={styles.heroGrid} />

            <View style={styles.heroTop}>
              <View style={styles.heroPill}>
                <View style={styles.heroPillDot} />
                <Text style={styles.heroPillText}>MANAGEMENT SUITE</Text>
              </View>

              <View style={styles.heroBadge}>
                <Ionicons name="sparkles-outline" size={17} color={colors.gold} />
              </View>
            </View>

            <View style={styles.heroMain}>
              <Text style={styles.heroEyebrow}>EVERYTHING IN ONE PLACE</Text>
              <Text style={styles.heroTitle}>Run the business.</Text>
              <Text style={styles.heroTitleAccent}>Stay in control.</Text>
              <Text style={styles.heroSub}>
                Operations, insights and administration — built into one focused workspace.
              </Text>
            </View>

            <View style={styles.heroFooter}>
              <View>
                <Text style={styles.heroFooterLabel}>ACTIVE TOOLS</Text>
                <Text style={styles.heroFooterValue}>06</Text>
              </View>
              <View style={styles.heroFooterDivider} />
              <View style={styles.heroFooterStatus}>
                <View style={styles.heroStatusDot} />
                <Text style={styles.heroFooterStatusText}>SYSTEMS READY</Text>
              </View>
              <View style={styles.heroFooterIcon}>
                <Ionicons name="arrow-forward" size={14} color={colors.white} />
              </View>
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

              <View style={styles.actions}>
                {group.items.map((item, itemIndex) => {
                  const [label, icon, section, description] = item;

                  return (
                    <Pressable
                      key={label}
                      onPress={() => go(section)}
                      style={({pressed}) => [
                        styles.action,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.actionIcon}>
                        <Ionicons name={icon} size={21} color={colors.teal} />
                      </View>

                      <View style={styles.actionCopy}>
                        <Text style={styles.actionTitle}>{label}</Text>
                        <Text style={styles.actionDesc}>{description}</Text>
                      </View>

                      <View style={styles.actionArrow}>
                        <Ionicons name="chevron-forward" size={17} color={colors.muted} />
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
              Management controls are available according to your account permissions.
            </Text>

            <View style={styles.adminRule} />

            <View style={styles.adminBottom}>
              <Text style={styles.adminBottomText}>ACCESS CONTROLLED</Text>
              <View style={styles.adminDot} />
            </View>
          </View>

          <Pressable
            onPress={signOut}
            style={({pressed}) => [styles.logout, pressed && styles.pressed]}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.white}
            />
            <Text style={styles.logoutTitle}>Sign out</Text>
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
    position: 'relative',
    minHeight: 228,
    backgroundColor: colors.midnight,
    borderRadius: 28,
    padding: 18,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D3940',
  },
  heroOrb: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -72,
    top: -78,
    backgroundColor: '#243D3D',
    opacity: 0.95,
  },
  heroGrid: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 54,
    height: 1,
    backgroundColor: '#314047',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroPill: {
    height: 25,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: '#233137',
    borderWidth: 1,
    borderColor: '#3A4A4F',
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroPillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gold,
    marginRight: 6,
  },
  heroPillText: {
    fontSize: 6.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#B9C5C7',
  },
  heroBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#203336',
    borderWidth: 1,
    borderColor: '#3C5554',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMain: {
    marginTop: 22,
  },
  heroEyebrow: {
    fontSize: 6.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.gold,
    marginBottom: 7,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.8,
    color: colors.white,
  },
  heroTitleAccent: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.8,
    color: '#8ED8CC',
  },
  heroSub: {
    fontSize: 9.5,
    lineHeight: 15,
    color: '#AEB9BC',
    marginTop: 10,
    maxWidth: 300,
  },
  heroFooter: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 13,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroFooterLabel: {
    fontSize: 5.5,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#718086',
  },
  heroFooterValue: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.white,
    marginTop: 1,
  },
  heroFooterDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#39464B',
    marginHorizontal: 14,
  },
  heroFooterStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  heroStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  heroFooterStatusText: {
    fontSize: 6,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#8C9A9E',
  },
  heroFooterIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    marginBottom: 32,
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
    marginTop: 10,
  },
  action: {
    minHeight: 70,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginVertical: 4,
    overflow: 'hidden',
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
    width: 24,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionArrowText: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.ink,
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
    height: 64,
    marginTop: 14,
    borderRadius: 20,
    backgroundColor: colors.danger,
    borderWidth: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    includeFontPadding: false,
  },
};