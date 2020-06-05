import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'

import Map, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

import { SvgUri } from 'react-native-svg'

import api from './../../services/api'

import styles from './styles'

interface Item {
    id: number
    title: string,
    image: string
}

interface Point {
    id: number,
    image: string,
    name: string,
    latitude: number,
    longitude: number,
    items: {
        title: string
    }[]
}

interface Param {
    city: string,
    uf: string,
}

const Point = () => {

    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [initialPosition, setInicialPosition] = useState<[number, number]>([0, 0])
    const [points, setPoints] = useState<Point[]>([])

    const route = useRoute()

    const params = route.params as Param

    useEffect(() => {

        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert('Precisamos de sua permissão para obter sua localização')
                return
            }

            const location = await Location.getCurrentPositionAsync()
            const { latitude, longitude } = location.coords
            setInicialPosition([latitude, longitude])
        }

        loadPosition()

    }, [])

    useEffect(() => {
        api.get('/items')
            .then(response => {
                setItems(response.data)
            })
    }, [])

    useEffect(() => {
        api.get('points', {
            params: {
                city: params.city,
                uf: params.uf,
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data)
        })
    }, [selectedItems])

    function navigateToDetail(id: number) {
        navigation.navigate('Detail', { pointId: id })
    }

    function handleSelect(id: number) {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id))
        } else {
            setSelectedItems([...selectedItems, id])
        }
    }

    const navigation = useNavigation()

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="#34CB79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <Map
                            style={styles.map}
                            loadingEnabled={initialPosition[0] == 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}
                        >
                            {points.map(item => (
                                <Marker
                                    key={String(item.id)}
                                    style={styles.mapMarker}
                                    onPress={() => navigateToDetail(item.id)}
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                    }}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: item.image }} />
                                        <Text style={styles.mapMarkerTitle}>{item.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </Map>
                    )}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items.map(item => (
                        <TouchableOpacity
                            key={String(item.id)}
                            style={selectedItems.includes(item.id) ? [styles.item, styles.selectedItem] : styles.item}
                            onPress={() => handleSelect(item.id)}
                            activeOpacity={0.6}
                        >
                            <SvgUri width={42} height={42} uri={item.image} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </View>

        </>
    )
}

export default Point