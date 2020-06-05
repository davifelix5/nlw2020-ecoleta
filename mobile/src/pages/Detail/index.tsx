import React, { useEffect, useState } from 'react'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { View, Text, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from '@react-navigation/native'
import api from './../../services/api'
import * as MailComposer from 'expo-mail-composer'

import styles from './styles'

interface PointParam {
    pointId: number
}

interface Data {
    point: {
        image: string,
        name: string,
        email: string,
        whatsapp: string,
        city: string,
        uf: string,
    },
    items: {
        title: string
    }[]
}

const Detail = () => {

    const route = useRoute()

    const params = route.params as PointParam
    const pointId = params.pointId

    const [data, setData] = useState<Data>({} as Data)

    useEffect(() => {
        api.get(`point/${pointId}`)
            .then(response => {
                setData(response.data)
            })
    }, [])

    const navigation = useNavigation()

    function composeMail() {
        MailComposer.composeAsync({
            subject: 'Coleta consciente de resíduos',
            recipients: [data.point.email],
        })
    }

    function handleWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}$text=Olá gostaria de saber mais sobre o serviõ de coleta de serviçoes forncedio por vocês`)
    }

    if (!data.point) {
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.point.image }} />
                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={composeMail}>
                    <Icon name="mail" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

export default Detail
