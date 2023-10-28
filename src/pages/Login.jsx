import { View, StyleSheet, ActivityIndicator, Button, ToastAndroid, KeyboardAvoidingView, TouchableOpacity, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { RecordContext } from '../context/context';
import StyledTextInput from '../components/styled/StyledTextInput';
import { doc, getDoc } from "firebase/firestore";



const Login = () => {

    const { loanding, setLoading, setdataUserDb } = useContext(RecordContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation(); // Obtiene el objeto navigation



    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // El código posterior aquí solo se ejecutará si la autenticación tiene éxito.


        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                ToastAndroid.show('usuario no encontrado', ToastAndroid.LONG);
            }
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
                ToastAndroid.show('La cuenta o la contrasena es incorrecta', ToastAndroid.LONG);
            }

        } finally {
            setLoading(false);

            if (auth.currentUser && auth.currentUser.uid) {
                const idUser = auth.currentUser.uid;
                let docRef = doc(FIRESTORE_DB, "estudiantes", idUser);
                let docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log("Document data estudiantes:", docSnap.data());
                } else {
                    docRef = doc(FIRESTORE_DB, "usuarios", idUser);
                    docSnap = await getDoc(docRef);
                    console.log("Document data normal:", docSnap.data());
                }
            }


        }
    }
    const navigateToSignUp = () => {
        //vacia los input al cambiar de pantalla
        setEmail('');
        setPassword('');
        navigation.navigate('SignUp')
    }


    return (
        <KeyboardAvoidingView behavior='height' style={styles.container}>
            <Text style={styles.logo}>Logo</Text>
            <Text style={styles.subtitle}>Ingresa a tu cuenta </Text>

            <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                placeholder='Email'
                autoCapitalize='none' />
            <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                placeholder='Password'
                autoCapitalize='none'
                secureTextEntry={true} />

            <View style={styles.reset}>
                <Text style={styles.textStyle}>Olvidaste tu contrasena?</Text>
            </View>

            {loanding ? (
                <ActivityIndicator size='large' color='#0000dff' />
            ) : (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={signIn}>
                        <Text style={styles.textStyle}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSignUp} onPress={navigateToSignUp}>
                        <Text style={styles.textStyleSignUp}>No tiene cuenta ? crea una!</Text>
                    </TouchableOpacity>
                </View>
            )}



        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1F22'
        // Color en formato hexadecimal
    },
    logo: {
        marginTop: 120,
        color: '#fff',
    },
    subtitle: {
        color: '#fff',
        marginVertical: 10,
    },
    buttonsContainer: {
        paddingTop: 80,
        alignItems: 'center',
        width: '100%',

    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        paddingStart: 30,
        width: '80%',
        height: 50,
        marginTop: 20,
        borderRadius: 30,
        marginVertical: 5,

    },

    button: {
        alignItems: "center",
        backgroundColor: "#56AF85",
        height: 50,
        padding: 16,
        width: '60%',
        marginBottom: 30,

        borderRadius: 8,
    },
    buttonSignUp: {
        alignItems: "center",

        height: 50,
        padding: 16,
        width: '60%',
        borderRadius: 8,

    },
    textStyle: {
        color: "#dedede"

    },
    textStyleSignUp: {
        color: '#2F5A73',

    },
    reset: {
        alignItems: "center",
        paddingLeft: 140,
        marginTop: 15,

    }

})

export default Login