import {AppText,AppTextInput} from '../components/AppText';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Pressable, ScrollView, View} from 'react-native';
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
              <AppText style={styles.headerKicker}>SM ASSOCIATE</AppText>
              <AppText style={styles.headerTitle}>CONTROL ROOM</AppText>
            </View>

            <View style={styles.headerCode}>
              <AppText style={styles.headerCodeTop}>06</AppText>
              <AppText style={styles.headerCodeBottom}>TOOLS</AppText>
            </View>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.headerStatus}>
              <View style={styles.liveDot} />
              <AppText style={styles.statusText}>OPERATIONS ACTIVE</AppText>
            </View>
            <AppText style={styles.headerDate}>BUSINESS / MANAGEMENT</AppText>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.hero}>
            <View style={styles.heroShapeOne} />
            <View style={styles.heroShapeTwo} />

            <View style={styles.heroTopLine}>
              <AppText style={styles.heroIndex}>02</AppText>
              <AppText style={styles.heroCategory}>BUSINESS INTELLIGENCE</AppText>
              <View style={styles.heroTopRule} />
            </View>

            <View style={styles.heroContent}>
              <AppText style={styles.heroTitle}>Your business,</AppText>
              <AppText style={styles.heroTitleAccent}>one clear view.</AppText>
              <AppText style={styles.heroDescription}>
                A focused space for the people, money and operations that keep SM Associate moving.
              </AppText>
            </View>

            <View style={styles.heroInsights}>
              <View style={styles.heroInsightPrimary}>
                <AppText style={styles.heroInsightNumber}>06</AppText>
                <AppText style={styles.heroInsightLabel}>TOOLS AT HAND</AppText>
              </View>

              <View style={styles.heroInsightDivider} />

              <View style={styles.heroInsight}>
                <AppText style={styles.heroInsightValue}>01</AppText>
                <AppText style={styles.heroInsightCaption}>OPERATE</AppText>
              </View>

              <View style={styles.heroInsight}>
                <AppText style={styles.heroInsightValue}>02</AppText>
                <AppText style={styles.heroInsightCaption}>INSIGHT</AppText>
              </View>
            </View>

            <View style={styles.heroBottomLine}>
              <View style={styles.heroStatusMark} />
              <AppText style={styles.heroBottomText}>CONTROL • CLARITY • MOMENTUM</AppText>
            </View>
          </View>

          {groups.map((group, groupIndex) => (
            <View key={group.label} style={styles.group}>
              <View style={styles.groupHead}>
                <View>
                  <AppText style={styles.groupLabel}>{group.label}</AppText>
                  <AppText style={styles.groupTitle}>{group.title}</AppText>
                </View>
                <AppText style={styles.groupNumber}>0{groupIndex + 1}</AppText>
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
                        <AppText style={styles.actionTitle}>{label}</AppText>
                        <AppText style={styles.actionDesc}>{description}</AppText>
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
              <AppText style={styles.adminTag}>ADMIN AREA</AppText>
            </View>

            <AppText style={styles.adminTitle}>Protected workspace</AppText>
            <AppText style={styles.adminDesc}>
              Management controls are available according to your account permissions.
            </AppText>

            <View style={styles.adminRule} />

            <View style={styles.adminBottom}>
              <AppText style={styles.adminBottomText}>ACCESS CONTROLLED</AppText>
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
            <AppText style={styles.logoutTitle}>Sign out</AppText>
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
    
    letterSpacing: 2,
    color: colors.teal,
  },
  headerTitle: {
    fontSize: 20,
    
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
    
    color: colors.white,
    lineHeight: 19,
  },
  headerCodeBottom: {
    fontSize: 5.5,
    
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
    
    letterSpacing: 1,
    color: colors.success,
  },
  headerDate: {
    fontSize: 6.5,
    
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
    minHeight: 286,
    backgroundColor: '#F7F8F5',
    borderRadius: 30,
    padding: 19,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E1E6E2',
  },
  heroShapeOne: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    right: -90,
    top: -88,
    backgroundColor: '#DCEFEA',
  },
  heroShapeTwo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    right: -22,
    top: -34,
    backgroundColor: '#BFDCD5',
    opacity: 0.72,
  },
  heroTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIndex: {
    fontSize: 9,
    
    color: colors.teal,
    letterSpacing: 0.5,
    marginRight: 9,
  },
  heroCategory: {
    fontSize: 6,
    
    letterSpacing: 1.5,
    color: '#657274',
  },
  heroTopRule: {
    flex: 1,
    height: 1,
    backgroundColor: '#DCE2DF',
    marginLeft: 10,
  },
  heroContent: {
    marginTop: 31,
    maxWidth: 310,
  },
  heroTitle: {
    fontSize: 31,
    lineHeight: 33,
    
    letterSpacing: -1.2,
    color: colors.ink,
  },
  heroTitleAccent: {
    fontSize: 31,
    lineHeight: 33,
    
    letterSpacing: -1.2,
    color: colors.teal,
  },
  heroDescription: {
    fontSize: 10,
    lineHeight: 16,
    color: '#5F6D70',
    marginTop: 13,
    maxWidth: 292,
  },
  heroInsights: {
    position: 'absolute',
    left: 19,
    right: 19,
    bottom: 42,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DDE3DF',
    paddingTop: 9,
  },
  heroInsightPrimary: {
    width: 72,
  },
  heroInsightNumber: {
    fontSize: 20,
    lineHeight: 20,
    
    color: colors.ink,
  },
  heroInsightLabel: {
    fontSize: 5.5,
    
    letterSpacing: 0.8,
    color: '#687574',
    marginTop: 3,
  },
  heroInsightDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#D7DEDA',
    marginHorizontal: 11,
  },
  heroInsight: {
    flex: 1,
    paddingLeft: 10,
  },
  heroInsightValue: {
    fontSize: 12,
    lineHeight: 13,
    
    color: colors.teal,
  },
  heroInsightCaption: {
    fontSize: 5.5,
    
    letterSpacing: 0.9,
    color: '#687574',
    marginTop: 3,
  },
  heroBottomLine: {
    position: 'absolute',
    left: 19,
    right: 19,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatusMark: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 7,
  },
  heroBottomText: {
    fontSize: 5.5,
    
    letterSpacing: 1.1,
    color: '#687574',
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
    
    letterSpacing: 1.8,
    color: colors.teal,
  },
  groupTitle: {
    fontSize: 19,
    
    color: colors.ink,
    marginTop: 3,
  },
  groupNumber: {
    fontSize: 24,
    
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
    
    letterSpacing: 1.2,
    color: '#8E9BA0',
  },
  adminTitle: {
    fontSize: 20,
    
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
    
    color: colors.white,
    includeFontPadding: false,
  },
};