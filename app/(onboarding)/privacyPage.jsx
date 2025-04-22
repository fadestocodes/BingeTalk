import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors';

const privacyPage = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
             <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20, alignSelf:'center' }} />

      <View style={styles.header} />
      <Text style={styles.updatedText}>Last Updated: April 16, 2025</Text>

      <Text style={styles.heading}>Privacy Policy</Text>
      <Text style={styles.bodyText}>
        This Privacy Policy explains how we collect, use, and protect your information when you use our app Bingeable.
      </Text>

      <Text style={styles.subheading}>1. Information We Collect</Text>
      <Text style={styles.bodyText}>
        We may collect certain information from you when you use the app, including:
      </Text>
      <View style={styles.listContainer}>
        <Text style={styles.bodyText}>- Account details (e.g., email address, username)</Text>
        <Text style={styles.bodyText}>- Usage data and preferences</Text>
        <Text style={styles.bodyText}>- Device information (e.g., device type, OS version)</Text>
      </View>

      <Text style={styles.subheading}>2. How We Use Your Information</Text>
      <Text style={styles.bodyText}>
        We use your information to:
      </Text>
      <View style={styles.listContainer}>
        <Text style={styles.bodyText}>- Provide and maintain the app</Text>
        <Text style={styles.bodyText}>- Improve user experience</Text>
        <Text style={styles.bodyText}>- Send relevant notifications and updates</Text>
      </View>

      <Text style={styles.subheading}>3. Sharing of Information</Text>
      <Text style={styles.bodyText}>
        We do not sell or rent your personal information. We may share data with third-party services we use to run the app, but only as necessary.
      </Text>

      <Text style={styles.subheading}>4. Data Retention</Text>
      <Text style={styles.bodyText}>
        We retain your data only for as long as necessary to fulfill the purposes outlined in this policy.
      </Text>

      <Text style={styles.subheading}>5. Your Choices</Text>
      <Text style={styles.bodyText}>
        You can choose to delete your account or data at any time. Please contact us using the information below.
      </Text>

      <Text style={styles.subheading}>6. Contact Us</Text>
      <Text style={styles.bodyText}>
        If you have any questions or concerns, please contact us at:
      </Text>
      <Text style={styles.bodyText}>Email: fadestocodes@gmail.com</Text>
      <Text style={styles.bodyText}>Website: bingeable.app</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 150,
    paddingTop: 70,
  },
  header: {
    width: 55,
    height: 7,
    borderRadius: 10,
    backgroundColor: Colors.mainGray, // Assuming Colors.mainGray is a shade of gray
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
  },
  updatedText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
    color: 'white',
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: 'white',
  },
  listContainer: {
    paddingLeft: 20,
    marginBottom: 10,
  },
});

export default privacyPage
