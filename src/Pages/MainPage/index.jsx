import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom'

import { AuthContext } from "../../contexts/auth";

import { createRepository, destroyRepository, getRepositories } from "../../services/api";

import Nav from "./Nav";
import Repositories from "./Repositories";
import Search from "./Search";

import "./styles.css"

const MainPage = () => {
    const {user, logout} = useContext(AuthContext)
    const [repositories, setRepositories] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(false)

    const loadData = async(query = '') =>{
        try {
            setLoading(true)
            const response = await getRepositories(user?.id, query)
            setRepositories(response.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoadingError(true)
        }
    }

    useEffect(() =>{
        (async () => await loadData())()
    }, [])
    
    const handleLogout = ()=>{
        console.log('logout')
        logout()
    }

    const handleSearch = async(query)=>{
        await loadData(query)
    }

    const handleClear =()=>{
        console.log('clear')
    }

    const handleDeleteRepo = async (repository) =>{
        console.log('delete repo', repository)
        await destroyRepository(user?.id, repository._id)
        await loadData()
    }
    const handleNewRepo = async(url) =>{
        console.log('new repo', url)
        try {
            await createRepository(user?.id, url)
            await loadData()
        } catch (err) {
            console.error(err)
            setLoadingError(true)
        }
    }

    if(loadingError){
        return(
            <div className="loading">Erro ao carregar os dados.<Link to="/login"> Voltar</Link></div>
        )
    }
    if(loading){
        return(
            <div className="loading">Carregando...</div>
        )
    }
    return(
        <div id="main">
            <Nav onLogout={handleLogout}/>
            <Search onClear={handleClear} onSearch={handleSearch}/>
            <Repositories
                repositories={repositories} 
                onNewRepo={handleNewRepo}
                onDeleteRepo={handleDeleteRepo}
            
            />
        </div>
    )
}

export default MainPage