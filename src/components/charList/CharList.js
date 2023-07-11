import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMessage';
import './charList.scss';


const CharList = (props) => {

    const [char, setChar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
    marvelService.getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharsLoaded = (newChar) => {
        let ended = false;
        if (newChar.length < 9) {
            ended = true;
        } 

        setChar(char => [...char, ...newChar]);
        setLoading(false);
        setError(error => false);
        setNewItemLoading(newItem => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemsRef = useRef([]);

    const focusChar = (id) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[id].classList.add('char__item_selected');
        itemsRef.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            const imgEl = item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? <img src={item.thumbnail} alt="abyss" style={{objectFit: 'unset'}}/> : <img src={item.thumbnail} alt="abyss" style={{objectFit: 'cover'}}/>

            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={el => itemsRef.current[i] = el}
                key={item.id}
                onClick={() => {
                    props.onCharSelected(item.id);
                    focusChar(i);    
                    }}
                onKeyPress={(e) => {
                    if (e.key === '' || e.key === 'Enter') {
                    props.onCharSelected(item.id);
                    focusChar(i); 
                    }
                }}>
                        {imgEl}
                        <div className="char__name">{item.name}</div>
                    </li>
            )
        });

        return (
            <ul className="char__grid">
                    {items}
                </ul>
        )
    }


    const items = renderItems(char);

    const errorMesage = error ? <ErrorMesage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(error || loading) ? items : null;
    
    return(
        <div className="char__list">
            {errorMesage}
            {spinner}
            {content}
            <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;