import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMessage';

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const onComicsLoaded = async (newComics) => {
        let ended = false;
        if (newComics < 9) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComics]);
        setNewComicsLoading(false);
        setOffset(offset => offset + 8)
        setComicsEnded(comicsEnded => ended)
    }
    
    function renderComics(arr) {
        const comics = arr.map((item, i) => {
            return (
                <CSSTransition timeout={500} classNames='comics__item'>
                    <li 
                        className="comics__item"
                        key={i}>
                            <Link to={`${item.id}`}>
                                <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                                <div className="comics__item-name">{item.title}</div>
                                <div className="comics__item-price">{item.price}</div>
                            </Link>
                    </li>
                </CSSTransition>
            )
        });

        return (
            <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {comics}
                </TransitionGroup>
            </ul>
        )
    }

    const listComics = renderComics(comics);

    const errorMesage = error ? <ErrorMesage/> : null;
    const spinner = loading && !newComicsLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMesage}
            {spinner}
            {listComics}
            <button 
            className="button button__main button__long"
            disabled={newComicsLoading}
            style={{'display': comicsEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;