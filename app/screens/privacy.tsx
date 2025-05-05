import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, StatusBar } from 'react-native';
import { useThemes } from '@/components/themeContext';
import Colors from '@/components/colors';

export default function PrivacyPolicy() {
    const { theme } = useThemes();
    const isDark = theme === 'dark';
    const backgroundColor = isDark ? Colors.darkModeBackground : Colors.background;
    const textColor = isDark ? Colors.darkModeText : Colors.text;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar barStyle="light-content" backgroundColor={isDark ? Colors.darkModePrimary : Colors.primary} />

            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={[styles.title, { color: textColor }]}>Privacy Policy</Text>

                <Text style={[styles.text, { color: textColor }]}>
                    Homy is committed to protecting your privacy. This policy describes how we collect, use, and protect your information.
                </Text>

                <Text style={[styles.subheading, { color: textColor }]}>1. Information We Collect</Text>
                <Text style={[styles.text, { color: textColor }]}>
                    We may collect your name, email address, phone number, apartment search behavior, and location data (if permitted).
                </Text>

                <Text style={[styles.subheading, { color: textColor }]}>2. How We Use Your Information</Text>
                <Text style={[styles.text, { color: textColor }]}>
                    We use your data to personalize apartment listings, provide support, and improve our services.
                </Text>

                <Text style={[styles.subheading, { color: textColor }]}>3. Data Sharing</Text>
                <Text style={[styles.text, { color: textColor }]}>
                    We do not sell your information. We may use trusted services like Firebase to store data securely.
                </Text>

                <Text style={[styles.subheading, { color: textColor }]}>4. Your Rights</Text>
                <Text style={[styles.text, { color: textColor }]}>
                    You can access, update, or delete your personal data anytime by contacting us.
                </Text>

                <Text style={[styles.subheading, { color: textColor }]}>5. Changes to This Policy</Text>
                <Text style={[styles.text, { color: textColor }]}>
                    We may update this policy. We'll notify users via the app in case of significant changes.
                </Text>

                <Text style={[styles.subheading, { color: textColor }]}>6. Contact</Text>
                <Text style={[styles.text, { color: textColor }]}>
                    For privacy questions, email us at homyteam@google.com.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subheading: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
    },
});
