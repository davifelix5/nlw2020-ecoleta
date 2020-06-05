import React, { useState } from 'react';
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'

import styles from './style'

const Home = () => {
    const [uf, setUf] = useState('')
    const [city, setCity] = useState('')
    const navigation = useNavigation()

    function navigateToPoints() {
        navigation.navigate('Points', { uf, city })
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground
                style={styles.container}
                source={require('./../../assets/home-background.png')}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('./../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}> Sua market palce de coleta de resíduos </Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TextInput
                        value={uf}
                        onChangeText={setUf}
                        maxLength={2}
                        autoCorrect={false}
                        style={styles.input}
                        placeholder="Digite a UF"
                        autoCapitalize="characters"
                    />
                    <TextInput
                        value={city}
                        onChangeText={setCity}
                        style={styles.input}
                        autoCorrect={false}
                        placeholder="Digite a cidade"
                    />
                    <RectButton style={styles.button} onPress={navigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default Home
