import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from './../../componets/Dropzone'
import api from '../../services/api'
import ibge from '../../services/ibge'
import Loader from '../../componets/Loader'
import SuccessScreen from './../../componets/SuccessScreen'

import './styles.css'

interface Item {
    id: number,
    title: string,
    image: string,
}

interface UfIBGEResponse {
    sigla: string,
    nome: string,
}

interface CityIBGEResponse {
    nome: string,
}


interface Uf {
    initials: string,
    name: string,
}


/*
Determina uma função que é executada quando o valor de uma variável mudar
O array vazio faz que com q função seja executada apenas uma fez, quando o com-
ponente é carregado pela primeira vez
O async não pode ser usado com o useEffect
*/

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([])
    const [UFs, setUFs] = useState<Uf[]>([])
    const [cityNames, setCities] = useState<string[]>([])

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [mapPosition, setMapPosition] = useState<[number, number]>([0, 0])
    const [selectedFile, setSelectedFile] = useState<File>()

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [initialPosition, setInicialPosition] = useState<[number, number]>([0, 0])

    const history = useHistory()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInicialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items')
            .then(response => {
                setItems(response.data)
            })
    }, []);

    useEffect(() => {
        ibge.get<UfIBGEResponse[]>('/')
            .then(response => {
                setUFs(response.data.map(uf => {
                    return { name: uf.nome, initials: uf.sigla }
                }))
            })
    }, [])

    useEffect(() => {
        ibge.get<CityIBGEResponse[]>(`${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data.map(city => city.nome))
            })
    }, [selectedUf])

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                history.push('/')
            }, 3000);
        }
    }, [success, history])


    function handleUfChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        const location = event.latlng
        setMapPosition([location.lat, location.lng])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        // Usa colchetes para por uma variável como nome de uma propriedade
        setFormData({ ...formData, [name]: value })
    }

    function handleClickItem(id: number) {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id))
        } else {
            setSelectedItems([...selectedItems, id])
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        setLoading(true)

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = mapPosition
        const items = selectedItems

        const data = new FormData()
        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))
        if (selectedFile) {
            data.append('image', selectedFile)
        }

        await api.post('point', data)
        setLoading(false)
        setSuccess(true)

    }

    return (
        <>
            {success && <SuccessScreen message="Cadastro concluído" />}
            <div id="page-create-point">
                <header>
                    <img src={logo} alt="Ecoleta" />
                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para home
                    </Link>
                </header>

                <form onSubmit={handleSubmit}>

                    <h1>Cadastro do <br></br> ponto de coletas</h1>

                    <Dropzone onFileUpload={setSelectedFile} />

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>
                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    id="whatsapp"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço no mapa</span>
                        </legend>

                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={mapPosition} />
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select name="uf" id="uf" onChange={handleUfChange}>
                                    <option value="0">Selecione um estado</option>
                                    {UFs.map(uf => (
                                        <option
                                            key={uf.initials}
                                            value={uf.initials}
                                        >
                                            {uf.name} ({uf.initials})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city" onChange={handleSelectCity}>
                                    <option value="0">Selecione uma cidade</option>
                                    {cityNames.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Items de coleta</h2>
                            <span>Selecione um ou mais itens abaixo</span>
                        </legend>
                        <ul className="items-grid">
                            {items.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => handleClickItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <button type="submit">
                        Cadastrar ponto de coleta
                        {loading && <Loader />}
                    </button>

                </form>
            </div>
        </>
    )
}

export default CreatePoint
