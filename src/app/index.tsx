  import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

  const OUTLET_SPOTS = {
    Q1: [
      { name: 'Spot 1', port: 'PORT A1', detail: 'USB-PD Fast Charge • AC Passthrough', available: true },
      { name: 'Spot 2', port: 'PORT A2', detail: 'USB-PD Fast Charge • Standard AC', available: true },
      { name: 'Spot 3', port: 'PORT A3', detail: 'Smart Balanced • Standard AC', available: true },
    ],
    Q3: [
      { name: 'Spot 1', port: 'PORT C1', detail: 'USB-PD Ultra Fast Charge • Low Grid Load', available: true },
      { name: 'Spot 2', port: 'PORT C2', detail: 'Currently in use', available: false },
      { name: 'Spot 3', port: 'PORT C3', detail: 'Currently in use', available: false },
    ],
  };

  export default function LoginScreen() {
   const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loggedIn, setLoggedIn] = useState(false);
const [error, setError] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [screen, setScreen] = useState('nearby');
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [resetEmail, setResetEmail] = useState('');
const [selectedSpot, setSelectedSpot] = useState(null);
const [selectedSpotIndex, setSelectedSpotIndex] = useState(-1);
const [selectedOutlet, setSelectedOutlet] = useState('Q1');
const [myTicketNum, setMyTicketNum] = useState(null);
const [aheadCount, setAheadCount] = useState(0);
const [loading, setLoading] = useState(false);
const [showSplash, setShowSplash] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setShowSplash(false), 2000);
  return () => clearTimeout(timer);
}, []);
      const spotIndex = selectedSpotIndex;
    const pad = (n) => String(n).padStart(3, '0');
    const ticketCode = myTicketNum !== null ? `#${pad(myTicketNum)}` : '#---';

     let chargingTicket = '#---';
    const queueRoster = [];
    let nextUpTicket = '#---';
    if (myTicketNum !== null) {
      const chargingNum = myTicketNum - aheadCount - 1;
      chargingTicket = `#${pad(chargingNum)}`;
      for (let i = 0; i < aheadCount; i++) {
        const id = `#${pad(chargingNum + 1 + i)}`;
        queueRoster.push({ id, status: i === 0 ? 'Next' : 'Waiting' });
        if (i === 0) nextUpTicket = id;
      }
      queueRoster.push({ id: `${ticketCode} (You)`, status: 'you' });
      queueRoster.push({ id: `#${pad(myTicketNum + 1)}`, status: 'Queued' });
      if (aheadCount === 0) nextUpTicket = ticketCode;
    }
    const handleLogin = () => {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both your email and password.');
        return;
      }
         setError('');
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setLoggedIn(true);
      }, 2000);
    };

    const handleForgotPassword = () => {
      if (!email.trim()) {
        Alert.alert(
          'Email needed',
          'Please enter your email or student ID first, then tap "Forgot password?" again.'
        );
        return;
      }
      Alert.alert(
        'Check your email',
        `If an account exists for ${email}, we've sent a password reset link.`
      );
    };

    const handleCheckIn = () => {
      Alert.alert('Checked in!', "You're plugged in and charging. Enjoy!");
      setScreen('nearby');
    };
         if (showSplash) {
      return (
        <View style={{ flex: 1, backgroundColor: '#1a3d2e', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 80 }}>⚡</Text>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#fff', marginTop: 10 }}>Silaw</Text>
          <Text style={{ fontSize: 13, color: '#9be8b0', marginTop: 6, letterSpacing: 1 }}>SMART POWER NETWORK</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <SafeAreaView style={[styles.container, { alignItems: 'center' }]}>
          <Text style={styles.logo}>⚡</Text>
          <Text style={styles.appName}>Silaw</Text>
          <ActivityIndicator size="large" color="#1a3d2e" style={{ marginTop: 20 }} />
          <Text style={styles.subTagline}>Finding outlets near you...</Text>
        </SafeAreaView>
      );
    }

    if (loggedIn) {
      return (
        <SafeAreaView style={styles.dashboardContainer}>
          <ScrollView
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {screen === 'nearby' && (
              <>
                <View style={[styles.headerRow, { paddingLeft: 20 }]}>
                  <View>
                    <Text style={styles.overline}>NEARBY OUTLETS</Text>
                    <Text style={styles.pageTitle}>Silaw</Text>
                    <Text style={styles.pageSubtitle}>Closest outlet to your seat</Text>
                  </View>
                  <TouchableOpacity style={styles.logoutChip} onPress={() => setLoggedIn(false)}>
                    <Text style={styles.logoutChipText}>Log out</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.closestBanner}>
                  <View style={styles.dot} />
                  <Text style={styles.closestBannerText}>
                    Closest to you: <Text style={{ fontWeight: '700' }}>Annex, 1F</Text> — 40 steps away
                  </Text>
                </View>

                <View style={styles.photoBanner}>
                  <Image
                    source={require('../../assets/images/il_1080xN.4926576768_lh5e.webp')}
                    style={styles.photoImage}
                    resizeMode="cover"
                  />
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoOverlayText}>
                      ☀️ Low grid congestion • 100% solar microgrid active
                    </Text>
                  </View>
                </View>

                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>CLOSEST TO YOU</Text>
                </View>

                <View style={styles.outletCard}>
                  <View style={{ padding: 16 }}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle}>Annex, 1F</Text>
                      <View style={styles.badgeFree}>
                        <Text style={styles.badgeFreeText}>Free</Text>
                      </View>
                    </View>
                    <Text style={styles.cardMeta}>45 steps away • 3 plugs available</Text>
                    <TouchableOpacity
                      style={styles.reserveButton}
                      onPress={() => setScreen('chooseOutlet')}
                    >
                      <Text style={styles.reserveButtonText}>📍  Reserve outlet</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>COMMONS</Text>
                </View>

                <View style={styles.outletCard}>
                  <View style={{ padding: 16 }}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle}>Cafeteria Hub</Text>
                      <View style={styles.badgeSoon}>
                        <Text style={styles.badgeSoonText}>Soon</Text>
                      </View>
                    </View>
                    <Text style={styles.cardMeta}>1 min walk • Currently occupied</Text>
                    <TouchableOpacity style={styles.notifyButton}>
                      <Text style={styles.notifyButtonText}>🔔  Notify me</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>SILENT STACKS</Text>
                </View>

                <View style={styles.outletCard}>
                  <View style={{ padding: 16 }}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle}>USTP</Text>
                      <View style={styles.badgeFull}>
                        <Text style={styles.badgeFullText}>Full</Text>
                      </View>
                    </View>
                    <Text style={styles.cardMeta}>3 min walk • Est. release in 35m</Text>
                    <TouchableOpacity style={styles.notifyButton}>
                      <Text style={styles.notifyButtonText}>🔔  Notify me</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.zeroCarbonCard}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>🔋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.zeroCarbonTitle}>Zero-Carbon Standby</Text>
                    <Text style={styles.zeroCarbonSubtitle}>
                      Outlets automatically idle when cables unplug
                    </Text>
                  </View>
                </View>
              </>
            )}

                      {screen === 'chooseOutlet' && (
              <>
                <View style={[styles.headerRow, { paddingLeft: 20, alignItems: 'center' }]}>
                  <TouchableOpacity onPress={() => setScreen('nearby')} style={{ marginTop: 16 }}>
                    <Text style={{ fontSize: 20, color: '#1a3d2e' }}>←</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.overline}>CIRCUIT INSPECTOR</Text>
                    <Text style={[styles.pageTitle, { fontSize: 20 }]}>Socket Node Inspector</Text>
                  </View>
                                  <View style={[styles.profileCircle, { marginRight: 25 }]}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>👤</Text>
                  </View>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 16 }}>
                  <Text style={styles.microgridLabel}>⚡ SILAW CAMPUS MICROGRID</Text>
                  <Text style={styles.chooseTitle}>Choose an Outlet</Text>
                  <Text style={styles.chooseSubtitle}>
                    Select an available outlet node to claim clean campus power
                  </Text>
                </View>

                <View style={styles.substationRow}>
                  <Text style={styles.substationDot}>●</Text>
                  <Text style={styles.substationText}>Annex West Substation</Text>
                  <View style={styles.solarBadge}>
                    <Text style={styles.solarBadgeText}>94% Solar Active</Text>
                  </View>
                </View>

                <View style={styles.outletCard}>
                  <View style={{ padding: 16 }}>
                    <View style={styles.cardTopRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, marginRight: 8 }}>🔌</Text>
                        <View>
                          <Text style={styles.cardTitle}>Outlet Q1</Text>
                          <Text style={styles.cardMeta}>Annex 1F • Desk cluster A</Text>
                        </View>
                      </View>
                      <View style={styles.badgeFree}>
                        <Text style={styles.badgeFreeText}>● Available</Text>
                      </View>
                    </View>

                                                    <Text style={[styles.plugInfoLeft, { marginTop: 10 }]}>{OUTLET_SPOTS.Q1.filter(s => s.available).length} plug{OUTLET_SPOTS.Q1.filter(s => s.available).length === 1 ? '' : 's'} available</Text>
                    <TouchableOpacity
                      style={styles.reserveButton}
                                          onPress={() => {
                                                setSelectedOutlet('Q1');
                        setSelectedSpot(null);
                        setSelectedSpotIndex(-1);
                        setMyTicketNum(null);
                        setAheadCount(0);
                        setScreen('chooseSpot');
                      }}
                    >
                      <Text style={styles.reserveButtonText}>Choose Q1 →</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.outletCard, { opacity: 0.6 }]}>
                  <View style={{ padding: 16 }}>
                    <View style={styles.cardTopRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, marginRight: 8 }}>🔌</Text>
                        <View>
                          <Text style={styles.cardTitle}>Outlet Q2</Text>
                          <Text style={styles.cardMeta}>Annex 1F • Desk cluster B</Text>
                        </View>
                      </View>
                      <View style={styles.badgeFull}>
                        <Text style={styles.badgeFullText}>● Full</Text>
                      </View>
                    </View>

                    <View style={styles.plugInfoRow}>
                      <Text style={styles.plugInfoLeft}>Currently full</Text>
                      <Text style={styles.plugInfoRight}>Occupied</Text>
                    </View>
                    <Text style={styles.plugDetailText}>
                      ⏱ Est. 24m remaining until node release
                    </Text>

                    <View style={styles.disabledButton}>
                      <Text style={styles.disabledButtonText}>🔒 Occupied</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.outletCard}>
                  <View style={{ padding: 16 }}>
                    <View style={styles.cardTopRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, marginRight: 8 }}>⚡</Text>
                        <View>
                          <Text style={styles.cardTitle}>Outlet Q3</Text>
                          <Text style={styles.cardMeta}>Annex 1F • Window bay C</Text>
                        </View>
                      </View>
                      <View style={styles.badgeFree}>
                        <Text style={styles.badgeFreeText}>● Available</Text>
                      </View>
                    </View>

                                                                  <Text style={[styles.plugInfoLeft, { marginTop: 10 }]}>{OUTLET_SPOTS.Q3.filter(s => s.available).length} plug{OUTLET_SPOTS.Q3.filter(s => s.available).length === 1 ? '' : 's'} available</Text>
                    <TouchableOpacity
                      style={styles.reserveButton}
                                        onPress={() => {
                                                  setSelectedOutlet('Q3');
                        setSelectedSpot(null);
                        setSelectedSpotIndex(-1);
                        setMyTicketNum(null);
                        setAheadCount(0);
                        setScreen('chooseSpot');
                      }}
                    >
                      <Text style={styles.reserveButtonText}>Choose Q3 →</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.zeroCarbonCard}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>🛡️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.zeroCarbonTitle}>Fair Use Power Guarantee</Text>
                    <Text style={styles.zeroCarbonSubtitle}>
                      Unclaimed reservations auto-release after 10 minutes to support fellow students.
                    </Text>
                  </View>
                </View>
                        </>
            )}

                      {screen === 'chooseSpot' && (
              <>
                <View style={[styles.headerRow, { paddingLeft: 20, alignItems: 'center' }]}>
                  <TouchableOpacity onPress={() => setScreen('chooseOutlet')} style={{ marginTop: 16 }}>
                    <Text style={{ fontSize: 20, color: '#1a3d2e' }}>←</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.overline}>CIRCUIT INSPECTOR</Text>
                    <Text style={[styles.pageTitle, { fontSize: 20 }]}>Socket Node Inspector</Text>
                  </View>
                                <View style={[styles.profileCircle, { marginRight: 25 }]}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>👤</Text>
                  </View>
                </View>
                          <View style={{ marginHorizontal: 20, marginTop: 12 }}>
                  <View style={styles.solarBadge}>
                    <Text style={styles.solarBadgeText}>⚡ SILAW CAMPUS MICROGRID • OUTLET {selectedOutlet}</Text>
                  </View>
                  <Text style={[styles.chooseTitle, { fontSize: 20 }]}>Choose a Spot</Text>
                  <Text style={styles.chooseSubtitle}>
                    Select an available socket port at Annex 1F • {selectedOutlet === 'Q1' ? 'Desk cluster A' : 'Window bay C'}
                  </Text>
                </View>

                <View style={styles.spotHeaderCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🖥️</Text>
                    <Text style={styles.spotHeaderTitle}>
                      {selectedOutlet === 'Q1' ? 'Desk Cluster A' : 'Window Bay C'} • Node {selectedOutlet}
                    </Text>
                  </View>
                                <View style={styles.spotHeaderRow}>
                    <Text style={styles.spotHeaderMeta}>
                      ⚡ {selectedOutlet === 'Q1' ? '& AC Available' : 'Ultra Available'}
                    </Text>
                    <View style={styles.solarBadge}>
                      <Text style={styles.solarBadgeText}>🟢 Grid Online</Text>
                    </View>
                  </View>
                  <Text style={styles.spotHeaderSolar}>☀️ 94% Solar</Text>
                </View>

                                                          {OUTLET_SPOTS[selectedOutlet].map((spot, idx) => (
                  <View key={spot.name} style={[styles.outletCard, !spot.available && { opacity: 0.6 }]}>
                    <View style={{ padding: 16 }}>
                      <View style={styles.cardTopRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ fontSize: 18, marginRight: 8 }}>🔌</Text>
                          <View>
                            <Text style={styles.cardTitle}>{spot.name}</Text>
                            <Text style={styles.cardMeta}>{spot.port}</Text>
                          </View>
                        </View>
                        {spot.available ? (
                          <View style={styles.badgeFree}>
                            <Text style={styles.badgeFreeText}>✓ Available</Text>
                          </View>
                        ) : (
                          <View style={styles.badgeFull}>
                            <Text style={styles.badgeFullText}>● Full</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.plugDetailText}>{spot.detail}</Text>

                                           {!spot.available ? (
                        <View style={styles.disabledButton}>
                          <Text style={styles.disabledButtonText}>🔒 Occupied</Text>
                        </View>
                      ) : selectedSpot === spot.name ? (
                        <View style={styles.selectedButton}>
                          <Text style={styles.selectedButtonText}>Selected  ✓</Text>
                        </View>
                      ) : (
                                               <TouchableOpacity
                          style={styles.notifyButton}
                                                  onPress={() => {
                            setSelectedSpot(spot.name);
                            setSelectedSpotIndex(idx);
                            const randomTicket = Math.floor(Math.random() * 90) + idx + 10;
                            setMyTicketNum(randomTicket);
                            setAheadCount(Math.floor(Math.random() * 5)); // 0 to 4 people ahead of you
                          }}
                        >
                          <Text style={styles.notifyButtonText}>Select {spot.name} →</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}

                            <View style={styles.activeSelectionCard}>
                  <Text style={styles.sectionLabel}>ACTIVE SELECTION</Text>
                  <View style={styles.activeSelectionTopRow}>
                                    <Text style={styles.activeSelectionTitle}>
                      {selectedSpot ? `Selected: Outlet ${selectedOutlet} – ${selectedSpot}` : `Choose a spot at Outlet ${selectedOutlet}`}
                    </Text>
                    <Text style={{ fontSize: 16 }}>🔋</Text>
                  </View>

                  <View style={styles.activeSelectionMetaRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activeSelectionMetaLabel}>Power Delivery</Text>
                      <Text style={styles.activeSelectionMetaValue}>65W USB-PD • 230V AC Microgrid</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activeSelectionMetaLabel}>Hold Window</Text>
                      <Text style={styles.activeSelectionMetaValue}>10 minutes</Text>
                    </View>
                  </View>

                  <Text style={styles.activeSelectionNote}>
                    Powered 100% by Annex South solar array. Your socket latch unlocks automatically upon physical arrival.
                  </Text>

                                <TouchableOpacity
                    style={[styles.reserveButton, !selectedSpot && { opacity: 0.5 }]}
                    disabled={!selectedSpot}
                    onPress={() => selectedSpot && setScreen('queue')}
                  >
                    <Text style={styles.reserveButtonText}>
                      {selectedSpot ? `🔒  Reserve ${selectedSpot}` : 'Select a spot to reserve'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ alignItems: 'center', marginTop: 10 }}
                    onPress={() => setScreen('chooseOutlet')}
                  >
                    <Text style={{ color: '#c0392b', fontWeight: '600', fontSize: 13 }}>
                      Cancel reservation
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.zeroCarbonCard}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>🛡️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.zeroCarbonTitle}>Fair Use Power Guarantee</Text>
                    <Text style={styles.zeroCarbonSubtitle}>
                      Unclaimed spot reservations automatically release after 10 minutes to support fellow students and maintain clean energy distribution.
                    </Text>
                  </View>
                </View>
              </>
            )}

                  {screen === 'queue' && (
              <>
                <View style={[styles.headerRow, { paddingLeft: 20 }]}>
                  <View>
                    <Text style={styles.overline}>SESSION ACTIVITY</Text>
                    <Text style={styles.pageTitle}>Queue status</Text>
                    <Text style={styles.pageSubtitle}>Your live spot in line</Text>
                  </View>
                  <View style={styles.locationChip}>
                    <Text style={styles.locationChipText}>📍 Annex, 1F</Text>
                  </View>
                </View>

                <View style={styles.statusPillRow}>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>📍 Annex, 1F • Pod B-04</Text>
                  </View>
                  <View style={styles.statusPillSynced}>
                    <Text style={styles.statusPillSyncedText}>🔄 Synced 2s ago</Text>
                  </View>
                </View>

                <View style={styles.activeSessionCard}>
                  <View style={styles.activeSessionTopRow}>
                    <Text style={styles.activeSessionLiveLabel}>● Queue status</Text>
                    <View style={styles.estBadge}>
                      <Text style={styles.estBadgeText}>EST. ~14 MIN</Text>
                    </View>
                  </View>
                  <Text style={styles.spotSubtitle}>You live spot in line</Text>

                                  <View style={styles.rankTicketRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.estWaitLabel}>ASSIGNED RANK</Text>
                      <Text style={styles.spotNumber}>{selectedSpot || 'Spot #—'}</Text>
                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.estWaitLabel}>TICKET CODE</Text>
                      <View style={styles.ticketCodeBox}>
                        <Text style={styles.ticketCodeText}>{ticketCode}</Text>
                      </View>
                    </View>
                  </View>

                                  <View style={styles.queueStatsRow}>
                    <View style={styles.queueStatBox}>
                      <Text style={styles.queueStatLabel}>👥 Ahead of you</Text>
                      <Text style={styles.queueStatValue}>{aheadCount} {aheadCount === 1 ? 'user' : 'users'}</Text>
                    </View>
                    <View style={styles.queueStatBox}>
                      <Text style={styles.queueStatLabel}>High turn over</Text>
                      <Text style={styles.queueStatValue}>↗</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>LIVE ROSTER • POD CIRCUIT #12</Text>
                </View>

                          <View style={styles.rosterCard}>
                  <View style={styles.rosterColumnsRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rosterColumnLabel}>🔋 Charging</Text>
                      <View style={styles.rosterEntry}>
                        <Text style={styles.rosterEntryId}>{chargingTicket}</Text>
                        <View style={styles.badgeFree}>
                          <Text style={styles.badgeFreeText}>Active</Text>
                        </View>
                      </View>
                      <Text style={styles.rosterEntryMeta}>⚡ 42W • 97% Full</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rosterColumnLabel}>⏱ Queue</Text>
                      {queueRoster.map((entry) => (
                        <View
                          key={entry.id}
                          style={entry.status === 'you' ? [styles.rosterEntry, styles.rosterEntryYou] : styles.rosterEntry}
                        >
                          <Text style={styles.rosterEntryId}>{entry.id}</Text>
                          {entry.status === 'you' ? (
                            <Text style={styles.rosterEntryStatusYou}>●</Text>
                          ) : (
                            <Text style={styles.rosterEntryStatus}>{entry.status}</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                                         {aheadCount === 0 ? (
                  <View style={[styles.transactionCard, { backgroundColor: '#1a3d2e' }]}>
                    <View style={styles.activeSessionTopRow}>
                      <Text style={[styles.transactionLabel, { color: '#9be8b0' }]}>🔔 It's your turn!</Text>
                      <View style={styles.badgeFree}>
                        <Text style={styles.badgeFreeText}>Ready</Text>
                      </View>
                    </View>
                    <Text style={[styles.spotSubtitle, { color: '#d8ece0' }]}>
                      Show this ticket at the outlet to plug in now
                    </Text>
                    <View style={styles.rankTicketRow}>
                      <Text style={[styles.spotNumber, { color: '#fff' }]}>{ticketCode}</Text>
                      <Text style={[styles.plugInfoRight, { color: '#d8ece0' }]}>⚡ Proceed to plug in</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.transactionCard}>
                    <View style={styles.activeSessionTopRow}>
                      <Text style={styles.transactionLabel}>● Next • Transaction State</Text>
                      <View style={styles.badgeFree}>
                        <Text style={styles.badgeFreeText}>Up Next</Text>
                      </View>
                    </View>
                    <Text style={styles.spotSubtitle}>Claims the socket next</Text>
                    <View style={styles.rankTicketRow}>
                      <Text style={styles.spotNumber}>{nextUpTicket}</Text>
                      <Text style={styles.plugInfoRight}>🔌 Awaiting Handoff</Text>
                    </View>
                  </View>
                )}

                  <TouchableOpacity
                  style={styles.turnButton}
                  onPress={() => setScreen('reserved')}
                >
                  <Text style={styles.turnButtonText}>⚡  It's my turn</Text>
                </TouchableOpacity>
                <Text style={styles.holdWindowNote}>Unlocks physical shutter on Pod B-04 upon arrival</Text>

                <View style={styles.reminderCard}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>🔔</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reminderTitle}>Pop up message for next in line</Text>
                    <Text style={styles.reminderSubtitle}>
                      Auto notification pings immediately when previous user concludes charging so the next student can claim the socket with a 3-minute grace buffer.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.leaveQueueButton}
                  onPress={() => setScreen('nearby')}
                >
                  <Text style={styles.leaveQueueText}>⏻  Leave queue</Text>
                </TouchableOpacity>
              </>
            )}

            {screen === 'reserved' && (
              <>
                <View style={[styles.headerRow, { paddingLeft: 20 }]}>
                  <View>
                    <Text style={styles.overline}>SESSION ACTIVITY</Text>
                    <Text style={styles.pageTitle}>Your activity</Text>
                    <Text style={styles.pageSubtitle}>Reservation and history</Text>
                  </View>
                  <TouchableOpacity style={styles.logoutChip} onPress={() => setLoggedIn(false)}>
                    <Text style={styles.logoutChipText}>Log out</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.activeSessionCard}>
                  <View style={styles.activeSessionTopRow}>
                    <Text style={styles.activeSessionTitle}>Annex, 1F – Desk 12</Text>
                    <View style={styles.badgeReserved}>
                      <Text style={styles.badgeReservedText}>Reserved for you</Text>
                    </View>
                  </View>
                  <Text style={styles.activeSessionMeta}>
                    Smart Node #A2-12 • 65W Rapid Socket
                  </Text>

                  <View style={styles.holdWindowBox}>
                    <Text style={styles.holdWindowLabel}>HOLD WINDOW EXPIRING</Text>
                    <Text style={styles.holdWindowTime}>00:00</Text>
                    <View style={styles.holdWindowMetaRow}>
                      <Text style={styles.holdWindowMetaText}>~2 min walk away</Text>
                      <Text style={styles.holdWindowMetaText}>Priority Locked</Text>
                    </View>
                  </View>

                  <Text style={styles.holdWindowNote}>
                    Held until timer ends so you don't lose your seat while you walk over to plug in.
                  </Text>

                  <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
                    <Text style={styles.checkInButtonText}>✓  I'm at the Outlet (Check In)</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {screen === 'activity' && (
              <>
                <View style={[styles.headerRow, { paddingLeft: 20 }]}>
                  <View>
                    <Text style={styles.overline}>SESSION ACTIVITY</Text>
                    <Text style={styles.pageTitle}>Your activity</Text>
                    <Text style={styles.pageSubtitle}>Reservation and history</Text>
                  </View>
                  <TouchableOpacity style={styles.logoutChip} onPress={() => setLoggedIn(false)}>
                    <Text style={styles.logoutChipText}>Log out</Text>
                  </TouchableOpacity>
                </View>

                              <View style={styles.recentSessionsHeaderRow}>
                  <Text style={styles.sectionLabel}>RECENT SESSIONS</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewLogText}>View Log</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.sessionRow}>
                  <Text style={styles.sessionIcon}>☕</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sessionTitle}>Cafeteria Hub</Text>
                    <Text style={styles.sessionMeta}>Today, 8:15 AM • 42 Wh draw</Text>
                  </View>
                  <View style={styles.badgeReleased}>
                    <Text style={styles.badgeReleasedText}>Released</Text>
                  </View>
                </View>

                <View style={styles.sessionRow}>
                  <Text style={styles.sessionIcon}>📚</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sessionTitle}>Science Hallway</Text>
                    <Text style={styles.sessionMeta}>Yesterday • 1hr 14 min</Text>
                  </View>
                  <View style={styles.badgeCompleted}>
                    <Text style={styles.badgeCompletedText}>Completed</Text>
                  </View>
                </View>

                <View style={styles.zeroCarbonCard}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>🌱</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.zeroCarbonTitle}>Zero Phantom Draw</Text>
                    <Text style={styles.zeroCarbonSubtitle}>
                      Outlets automatically idle off when unplugged, cutting 18% campus waste.
                    </Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setScreen('nearby')}
            >
              <Text style={styles.tabIcon}>⚡</Text>
              <Text style={[styles.tabLabel, screen === 'nearby' && styles.tabLabelActive]}>
                Nearby
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setScreen('activity')}
            >
              <Text style={styles.tabIcon}>🕘</Text>
              <Text style={[styles.tabLabel, screen === 'activity' && styles.tabLabelActive]}>
                Activity
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

        if (showForgotPassword) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={[styles.card, { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%' }]}>
            <Text style={styles.logo}>🔑</Text>
            <Text style={styles.appName}>Reset Password</Text>
            <Text style={styles.subTagline}>
              Enter your email and we'll send you a reset link
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email or Student ID</Text>
              <TextInput
                style={styles.input}
                placeholder="you@school.edu"
                placeholderTextColor="#aaa"
                value={resetEmail}
                onChangeText={setResetEmail}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                Alert.alert('Reset link sent', `A password reset link has been sent to ${resetEmail || 'your email'}.`);
                setShowForgotPassword(false);
              }}
            >
              <Text style={styles.loginButtonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center' }}
              onPress={() => setShowForgotPassword(false)}
            >
              <Text style={{ color: '#1a3d2e', fontWeight: '600', fontSize: 13 }}>
                ← Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.card, { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%' }]}>
          <Text style={styles.logo}>⚡</Text>
          <Text style={styles.appName}>Silaw</Text>
          <Text style={styles.tagline}>SMART POWER NETWORK</Text>
          <Text style={styles.subTagline}>Find. Reserve. Charge.</Text>

          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.instructions}>
            Sign in to reserve your study desk outlet
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email or Student ID</Text>
            <TextInput
              style={styles.input}
              placeholder="you@school.edu"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In →</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR CONTINUE WITH</Text>

          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAF9F6',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    dashboardContainer: {
      flex: 1,
      backgroundColor: '#FAF9F6',
    },
    card: {
      alignItems: 'center',
    },
    logo: {
      fontSize: 40,
      marginBottom: 8,
    },
    appName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1a3d2e',
    },
    tagline: {
      fontSize: 12,
      color: '#888',
      letterSpacing: 1,
      marginTop: 4,
    },
    subTagline: {
      fontSize: 13,
      fontStyle: 'italic',
      color: '#555',
      marginBottom: 24,
    },
    welcome: {
      fontSize: 20,
      fontWeight: '600',
      alignSelf: 'flex-start',
    },
    instructions: {
      fontSize: 13,
      color: '#666',
      alignSelf: 'flex-start',
      marginBottom: 16,
    },
    fieldGroup: {
      width: '100%',
      marginTop: 8,
    },
    label: {
      fontSize: 12,
      color: '#333',
      marginBottom: 4,
    },
    input: {
      width: '100%',
      height: 38,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 13,
      backgroundColor: '#fff',
    },
    passwordWrapper: {
      width: '100%',
      height: 38,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#fff',
    },
    passwordInput: {
      flex: 1,
      height: '100%',
      paddingHorizontal: 10,
      fontSize: 13,
    },
    eyeButton: {
      paddingHorizontal: 10,
      height: '100%',
      justifyContent: 'center',
    },
    eyeIcon: {
      fontSize: 16,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      color: '#1a3d2e',
      fontSize: 12,
      marginTop: 8,
    },
    errorText: {
      color: '#c0392b',
      fontSize: 12,
      marginTop: 10,
      alignSelf: 'flex-start',
    },
    loginButton: {
      backgroundColor: '#1a3d2e',
      width: '100%',
      height: 48,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    loginButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    orText: {
      fontSize: 11,
      color: '#999',
      marginTop: 16,
      marginBottom: 8,
    },
    googleButton: {
      borderWidth: 1,
      borderColor: '#1a3d2e',
      width: '100%',
      height: 48,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleButtonText: {
      color: '#1a3d2e',
      fontWeight: '500',
    },
    signupText: {
      marginTop: 20,
      fontSize: 13,
      color: '#555',
    },
    signupLink: {
      color: '#1a3d2e',
      fontWeight: '600',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 16,
    },
    overline: {
      fontSize: 12,
      color: '#8a8f87',
      letterSpacing: 0.5,
    },
    pageTitle: {
      fontSize: 30,
      fontWeight: '800',
      color: '#1a3d2e',
      marginTop: 4,
    },
    pageSubtitle: {
      fontSize: 13,
      color: '#8a8f87',
      marginTop: 2,
    },
    logoutChip: {
      backgroundColor: '#fff',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#e4e4e0',
      marginTop: 16,
      marginRight: 15,
    },
    logoutChipText: {
      color: '#1a3d2e',
      fontWeight: '700',
      fontSize: 12,
    },
    locationChip: {
      backgroundColor: '#fff',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#e4e4e0',
      marginTop: 16,
      marginRight: 15,
    },
    locationChipText: {
      color: '#1a3d2e',
      fontWeight: '600',
      fontSize: 12,
    },
    closestBanner: {
      backgroundColor: '#e6f0e9',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginTop: 18,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#3fae5a',
      marginRight: 8,
    },
    closestBannerText: {
      fontSize: 13,
      color: '#1a3d2e',
      flexShrink: 1,
    },
    photoBanner: {
      height: 130,
      borderRadius: 18,
      backgroundColor: '#c9c2b1',
      marginTop: 16,
      marginHorizontal: 10,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    photoImage: {
      ...StyleSheet.absoluteFillObject,
    },
    photoOverlay: {
      backgroundColor: 'rgba(26,61,46,0.55)',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    photoOverlayText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    sectionHeaderRow: {
      marginTop: 22,
      marginBottom: 8,
      marginHorizontal: 19,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#9a9a94',
      letterSpacing: 1,
    },
    outletCard: {
      backgroundColor: '#fff',
      borderRadius: 18,
      marginHorizontal: 10,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#1a1a1a',
    },
    cardMeta: {
      fontSize: 13,
      color: '#777',
      marginTop: 4,
    },
    badgeFree: {
      backgroundColor: '#1a3d2e',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 14,
    },
    badgeFreeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    badgeSoon: {
      backgroundColor: '#c98a1e',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 14,
    },
    badgeSoonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    badgeFull: {
      backgroundColor: '#9a9a94',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 14,
    },
    badgeFullText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    reserveButton: {
      backgroundColor: '#1a3d2e',
      borderRadius: 24,
      paddingVertical: 12,
      marginTop: 12,
      alignItems: 'center',
    },
    reserveButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    notifyButton: {
      backgroundColor: '#f0f0ee',
      borderRadius: 24,
      paddingVertical: 11,
      marginTop: 12,
      alignItems: 'center',
    },
    notifyButtonText: { color: '#333', fontWeight: '600', fontSize: 14 },
    zeroCarbonCard: {
      backgroundColor: '#e6f0e9',
      borderRadius: 18,
      padding: 16,
      marginTop: 20,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    zeroCarbonTitle: { fontSize: 14, fontWeight: '700', color: '#1a3d2e' },
    zeroCarbonSubtitle: { fontSize: 12, color: '#3d5a4c', marginTop: 2 },

    activeSessionCard: {
      backgroundColor: '#fff',
      borderRadius: 18,
      marginHorizontal: 10,
      marginTop: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    activeSessionTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    activeSessionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#1a1a1a',
      flexShrink: 1,
    },
    activeSessionMeta: {
      fontSize: 13,
      color: '#777',
      marginTop: 4,
    },
    activeSessionLiveLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: '#3fae5a',
    },
    activeSessionStation: {
      fontSize: 12,
      color: '#9a9a94',
    },
    spotNumber: {
      fontSize: 30,
      fontWeight: '800',
      color: '#1a3d2e',
      marginTop: 6,
    },
    spotSubtitle: {
      fontSize: 13,
      color: '#777',
      marginTop: 2,
    },
    progressTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: '#eee',
      marginTop: 14,
      overflow: 'hidden',
    },
    progressFill: {
      width: '35%',
      height: '100%',
      backgroundColor: '#1a3d2e',
      borderRadius: 3,
    },
    estWaitRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    estWaitLabel: {
      fontSize: 11,
      color: '#9a9a94',
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    estWaitValue: {
      fontSize: 12,
      color: '#1a3d2e',
      fontWeight: '700',
    },
    queueStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      backgroundColor: '#f6f6f4',
      borderRadius: 14,
      padding: 12,
    },
    queueStatBox: {
      alignItems: 'center',
      flex: 1,
    },
    queueStatLabel: {
      fontSize: 11,
      color: '#8a8f87',
    },
    queueStatValue: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1a1a1a',
      marginTop: 2,
    },
    reminderCard: {
      backgroundColor: '#e6f0e9',
      borderRadius: 16,
      padding: 14,
      marginHorizontal: 10,
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    reminderTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1a3d2e',
    },
    reminderSubtitle: {
      fontSize: 12,
      color: '#3d5a4c',
      marginTop: 2,
    },
    breakRow: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 14,
      marginHorizontal: 10,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    breakTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1a1a1a',
    },
    breakSubtitle: {
      fontSize: 12,
      color: '#8a8f87',
      marginTop: 2,
    },
      turnButton: {
      backgroundColor: '#1a3d2e',
      borderRadius: 24,
      paddingVertical: 13,
      marginHorizontal: 10,
      marginTop: 20,
      alignItems: 'center',
    },
    turnButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    leaveQueueButton: {
      alignItems: 'center',
      marginTop: 14,
    },
    leaveQueueText: {
      color: '#c0392b',
      fontWeight: '700',
      fontSize: 14,
    },

    holdWindowBox: {
      backgroundColor: '#f6f6f4',
      borderRadius: 14,
      padding: 14,
      marginTop: 14,
      alignItems: 'center',
    },
    holdWindowLabel: {
      fontSize: 11,
      color: '#8a8f87',
      letterSpacing: 0.5,
      fontWeight: '600',
    },
    holdWindowTime: {
      fontSize: 30,
      fontWeight: '800',
      color: '#1a1a1a',
      marginTop: 4,
    },
    holdWindowMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
    },
    holdWindowMetaText: {
      fontSize: 12,
      color: '#8a8f87',
    },
    holdWindowNote: {
      fontSize: 12,
      color: '#666',
      marginTop: 12,
      lineHeight: 17,
    },
    checkInButton: {
      backgroundColor: '#1a3d2e',
      borderRadius: 24,
      paddingVertical: 13,
      marginTop: 14,
      alignItems: 'center',
    },
    checkInButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    badgeReserved: {
      backgroundColor: '#1a3d2e',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
    },
    badgeReservedText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    recentSessionsHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 22,
      marginBottom: 8,
      marginHorizontal: 19,
    },
    viewLogText: {
      fontSize: 12,
      color: '#1a3d2e',
      fontWeight: '600',
    },
    sessionRow: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginHorizontal: 10,
      marginBottom: 10,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    sessionIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    sessionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#1a1a1a',
    },
    sessionMeta: {
      fontSize: 12,
      color: '#8a8f87',
      marginTop: 2,
    },
    badgeReleased: {
      backgroundColor: '#f0f0ee',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
    },
    badgeReleasedText: { color: '#555', fontSize: 11, fontWeight: '700' },
    badgeCompleted: {
      backgroundColor: '#e6f0e9',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
    },
    badgeCompletedText: { color: '#1a3d2e', fontSize: 11, fontWeight: '700' },

    tabBar: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#eee',
      backgroundColor: '#fff',
      paddingVertical: 8,
      paddingBottom: 16,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabIcon: {
      fontSize: 18,
    },
    tabLabel: {
      fontSize: 12,
      color: '#9a9a94',
      marginTop: 2,
      fontWeight: '600',
    },
    tabLabelActive: {
      color: '#1a3d2e',
    },
    profileCircle: {
      width: 45,
      height: 45,
      borderRadius: 22,
      backgroundColor: '#1a3d2e',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      overflow: 'hidden',
    },
    microgridLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#3fae5a',
      letterSpacing: 0.5,
    },
    chooseTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: '#1a1a1a',
      marginTop: 6,
    },
    chooseSubtitle: {
      fontSize: 13,
      color: '#777',
      marginTop: 4,
    },
    substationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 8,
    },
    substationDot: {
      color: '#3fae5a',
      fontSize: 10,
      marginRight: 6,
    },
    substationText: {
      fontSize: 13,
      color: '#333',
      flex: 1,
    },
    solarBadge: {
      backgroundColor: '#e6f0e9',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    solarBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#1a3d2e',
    },
    plugInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    plugInfoLeft: {
      fontSize: 13,
      color: '#333',
      fontWeight: '600',
    },
    plugInfoRight: {
      fontSize: 12,
      color: '#777',
    },
    plugDetailText: {
      fontSize: 12,
      color: '#8a8f87',
      marginTop: 4,
    },
    disabledButton: {
      backgroundColor: '#eee',
      borderRadius: 24,
      paddingVertical: 12,
      marginTop: 14,
      alignItems: 'center',
    },
    disabledButtonText: {
      color: '#9a9a94',
      fontWeight: '600',
      fontSize: 14,
    },
    spotHeaderCard: {
      backgroundColor: '#fff',
      borderRadius: 18,
      marginHorizontal: 10,
      marginTop: 14,
      marginBottom: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    spotHeaderTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#1a1a1a',
    },
    spotHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    spotHeaderMeta: {
      fontSize: 12,
      color: '#777',
      flexShrink: 1,
      marginRight: 8,
    },
    spotHeaderSolar: {
      fontSize: 12,
      color: '#3fae5a',
      fontWeight: '600',
      marginTop: 6,
    },
    selectedButton: {
      backgroundColor: '#1a3d2e',
      borderRadius: 24,
      paddingVertical: 11,
      marginTop: 12,
      alignItems: 'center',
    },
    selectedButtonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 14,
    },
    activeSelectionCard: {
      backgroundColor: '#e6f0e9',
      borderRadius: 18,
      marginHorizontal: 10,
      marginTop: 20,
      padding: 16,
    },
    activeSelectionTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    activeSelectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1a3d2e',
      flexShrink: 1,
    },
    activeSelectionMetaRow: {
      flexDirection: 'row',
      marginTop: 14,
    },
    activeSelectionMetaLabel: {
      fontSize: 11,
      color: '#3d5a4c',
      fontWeight: '700',
    },
    activeSelectionMetaValue: {
      fontSize: 12,
      color: '#1a3d2e',
      marginTop: 2,
    },
      activeSelectionNote: {
      fontSize: 12,
      color: '#3d5a4c',
      marginTop: 12,
      lineHeight: 17,
    },
    statusPillRow: {
      flexDirection: 'row',
      marginHorizontal: 10,
      marginTop: 16,
      gap: 8,
    },
    statusPill: {
      backgroundColor: '#fff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#e4e4e0',
    },
    statusPillText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#333',
    },
    statusPillSynced: {
      backgroundColor: '#e6f0e9',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    statusPillSyncedText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#1a3d2e',
    },
    estBadge: {
      backgroundColor: '#e6f0e9',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    estBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#1a3d2e',
    },
    rankTicketRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: 16,
    },
    ticketCodeBox: {
      backgroundColor: '#f0f0ee',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      marginTop: 4,
    },
    ticketCodeText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#1a1a1a',
    },
    rosterCard: {
      backgroundColor: '#fff',
      borderRadius: 18,
      marginHorizontal: 10,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    rosterColumnsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    rosterColumnLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: '#8a8f87',
      marginBottom: 8,
    },
    rosterEntry: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    rosterEntryYou: {
      backgroundColor: '#e6f0e9',
      borderRadius: 10,
      paddingHorizontal: 8,
    },
    rosterEntryId: {
      fontSize: 13,
      fontWeight: '600',
      color: '#1a1a1a',
    },
    rosterEntryMeta: {
      fontSize: 12,
      color: '#777',
      marginTop: 2,
    },
    rosterEntryStatus: {
      fontSize: 12,
      color: '#8a8f87',
    },
    rosterEntryStatusYou: {
      fontSize: 12,
      color: '#3fae5a',
      fontWeight: '700',
    },
    transactionCard: {
      backgroundColor: '#fff',
      borderRadius: 18,
      marginHorizontal: 10,
      marginTop: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    transactionLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: '#c98a1e',
    },
  });