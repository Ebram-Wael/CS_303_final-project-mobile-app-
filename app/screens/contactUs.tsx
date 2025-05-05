import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    StatusBar
} from "react-native"
import Colors from "@/components/colors";
import { useThemes } from '@/components/themeContext';
import GoogleIcon from '@/assets/icons/icons8-google.svg';
import WhatsAppIcon from '@/assets/icons/whatsapp-brands-solid.svg';
import CallIcon from '@/assets/icons/call.svg';

export default function ContactUs() {
    const { theme } = useThemes();
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.darkModeBackground : Colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor={isDark ? Colors.darkModePrimary : Colors.primary} />

            <View style={styles.head}>
                <Text style={[styles.title, { color: isDark ? Colors.darkModeText : Colors.text }]}>Contact Us</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.icon}>
                    <CallIcon width={20} height={20} />
                </View>
                <Text style={styles.text}>0125 555 6789</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.icon}>
                    <WhatsAppIcon width={20} height={20} />
                </View>
                <Text style={styles.text}>0116 666 6789</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.icon}>
                    <WhatsAppIcon width={20} height={20} />
                </View>
                <Text style={styles.text}>0154 777 8899</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.icon}>
                    <GoogleIcon width={20} height={20} />
                </View>
                <Text style={styles.text}>homyteam@gmail.com</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    head: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 7,
        marginVertical: 6,
        padding: 16,
        borderRadius: 12,
        elevation: 3,
        backgroundColor: "white",
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
    },
    icon: {
        marginRight: 12,
    },
    text: {
        fontSize: 16,
    },
});
