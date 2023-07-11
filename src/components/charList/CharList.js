import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMessage';
import './charList.scss';


class CharList extends Component {
    state = {
        char: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    onCharsLoaded = (newChar) => {
        let ended = false;
        if (newChar.length < 9) {
            ended = true;
        } 


        this.setState(({offset, char}) => ({
                char: [...char, ...newChar],
                loading: false,
                newItemLoading: false,
                error: false,
                offset: offset + 9,
                charEnded: ended
        }))
    }

    itemsRef = [];

    setCharRef = (ref) => {
        this.itemsRef.push(ref);
    }

    focusChar = (id) => {
        this.itemsRef.forEach(item => item.classList.remove('char__item_selected'));
        this.itemsRef[id].classList.add('char__item_selected');
        this.itemsRef[id].focus();
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    renderItems(arr) {
        const items = arr.map((item, i) => {
            const imgEl = item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? <img src={item.thumbnail} alt="abyss" style={{objectFit: 'unset'}}/> : <img src={item.thumbnail} alt="abyss" style={{objectFit: 'cover'}}/>

            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={this.setCharRef}
                key={item.id}
                onClick={() => {
                    this.props.onCharSelected(item.id);
                    this.focusChar(i);    
                    }}
                onKeyPress={(e) => {
                    if (e.key === '' || e.key === 'Enter') {
                    this.props.onCharSelected(item.id);
                    this.focusChar(i); 
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


    render () {
        const {char, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.renderItems(char);

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
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;