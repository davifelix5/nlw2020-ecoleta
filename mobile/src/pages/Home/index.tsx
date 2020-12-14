import React, { useState, useEffect } from 'react';
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import { RectButton } from 'react-native-gesture-handler'
import RNPickerSelect from 'react-native-picker-select'
import { Feather as Icon } from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'

import ibge from './../../services/ibge'

import styles from './style'

interface Uf {
    initials: string,
    name: string,
}

interface UfIBGE {
    sigla: string,
    nome: string
}

interface City {
    name: string
}

interface CityIBGE {
    nome: string
}


const Home = () => {
    const [ufs, setUfs] = useState<Uf[]>([])
    const [selectedUf, setSelectedUf] = useState<Uf>({} as Uf)
    const [cities, setCities] = useState<City[]>([])
    const [selectedCity, setSelectedCity] = useState<City>({} as City)
    const navigation = useNavigation()

    useEffect(() => {
        ibge.get<UfIBGE[]>('')
            .then(response => {
                setUfs(response.data.map(item => {
                    return {
                        initials: item.sigla,
                        name: item.nome
                    }
                }))
            })
    }, [])

    useEffect(() => {
        if (JSON.stringify(selectedUf) == '{}') return  // Objeto vazio (tenta !!selectedUf)
        ibge.get<CityIBGE[]>(`${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data.map(city => {
                    return {
                        name: city.nome
                    }
                }))
            })
    }, [selectedUf])

    function navigateToPoints() {
        navigation.navigate('Points', { uf: selectedUf, city: selectedCity })
    }

    function handleSelectUf(value: Uf) {
        setSelectedUf(value)
    }

    function handleSelectCity(value: City) {
        setSelectedCity(value)
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

                    <RNPickerSelect
                        items={ufs.map(uf => {
                            return {
                                label: `${uf.name} (${uf.initials})`,
                                value: uf.initials,
                            }
                        })}
                        onValueChange={handleSelectUf}
                        placeholder={{ label: 'Seleciona uma UF', value: 0 }}
                    />
                    <RNPickerSelect
                        items={cities.map(city => {
                            return {
                                label: city.name,
                                value: city.name,
                            }
                        })}
                        onValueChange={handleSelectCity}
                        placeholder={{ label: 'Seleciona uma cidade', value: '' }}
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
