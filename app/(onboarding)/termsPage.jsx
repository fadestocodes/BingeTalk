import { StyleSheet, Text, View , ScrollView} from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'


const termsPage = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>       
     <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20, alignSelf:'center' }} />

    <Text style={styles.updatedText}>Last Updated: April 18, 2025</Text>

    <Text style={styles.heading}>Welcome to Bingeable!</Text>
    <Text style={styles.bodyText}>
      These Terms of Use (“Terms”) govern your use of the Bingeable mobile application and any related services (collectively, the “App”), operated by [Your Company Name] (“we,” “us,” or “our”).
    </Text>

    <Text style={styles.bodyText}>
      By accessing or using the App, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the App.
    </Text>

    <Text style={styles.subheading}>1. User-Generated Content</Text>
    <Text style={styles.bodyText}>
      Bingeable allows users to create and share content, including text posts, comments, ratings, and images. You are solely responsible for the content you submit. You agree not to post content that:
    </Text>
    <View style={styles.listContainer}>
      <Text style={styles.bodyText}>- Is offensive, abusive, threatening, or harassing</Text>
      <Text style={styles.bodyText}>- Contains hate speech or promotes discrimination</Text>
      <Text style={styles.bodyText}>- Includes explicit, violent, or sexually suggestive material</Text>
      <Text style={styles.bodyText}>- Violates any laws or regulations</Text>
      <Text style={styles.bodyText}>- Infringes upon intellectual property rights</Text>
      <Text style={styles.bodyText}>- Contains spam, scams, or malicious links</Text>
    </View>

    <Text style={styles.subheading}>2. Zero-Tolerance Policy</Text>
    <Text style={styles.bodyText}>
      We have a zero-tolerance policy for objectionable content and abusive users. We reserve the right to remove content and suspend or ban users who violate these Terms.
    </Text>
    <Text style={styles.bodyText}>
      Users can report inappropriate content through the app or by contacting us directly at fadestocodes@gmail.com. Reports are reviewed promptly, and action will be taken at our discretion.
    </Text>

    <Text style={styles.subheading}>3. Content Rights</Text>
    <Text style={styles.bodyText}>
      By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content within the App. You retain full ownership of your content.
    </Text>
    <Text style={styles.bodyText}>
      You must have the legal right to share any content you post, including media, images, or other copyrighted materials.
    </Text>

    <Text style={styles.subheading}>4. Termination</Text>
    <Text style={styles.bodyText}>
      We may suspend or terminate your account at any time for violations of these Terms or for any behavior deemed harmful to the community.
    </Text>

    <Text style={styles.subheading}>5. Changes to the Terms</Text>
    <Text style={styles.bodyText}>
      We may update these Terms occasionally. We’ll notify users of any major changes. Continued use of the App after changes go into effect means you accept the new Terms.
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
  paddingBottom:150,
  paddingTop:70
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
  color:'white'
},
subheading: {
  fontSize: 18,
  fontWeight: '600',
  marginTop: 20,
  marginBottom: 5,
  color:'white'
},
bodyText: {
  fontSize: 16,
  lineHeight: 24,
  marginBottom: 10,
  color:'white'
},
listContainer: {
  paddingLeft: 20,
  marginBottom: 10,
},
});

export default termsPage
