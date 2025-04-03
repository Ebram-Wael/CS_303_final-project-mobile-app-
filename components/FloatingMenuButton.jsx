import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

export default function FloatingMenuButton() {
const navigation = useNavigation();
return (
    <TouchableOpacity
    style={{
        position: 'absolute',
        top: '5%',
        left: '6%',
        backgroundColor:  'transparent',
        width: 33,
        height: 33,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    }}
    onPress={() => navigation.toggleDrawer()}
    >
        <Ionicons name="menu" size={27} color="white" />
    </TouchableOpacity>
    );
}