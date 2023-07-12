import './singleComics.scss';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMessage';

const SingleComics = () => {

    const [comics, setComics] = useState({});

    const {loading, error, getComics} = useMarvelService();

    useEffect(() => {
        onRequest()
    }, [])

    const onComicsLoaded = (comics) => {
        setComics(comics);
    }

    const onRequest = () => {
        const id = 211;
        getComics(id)
            .then(onComicsLoaded)
    }

    const errorMessage = error ? <ErrorMesage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View comics={comics} /> : null;

    return (
        <div className="single-comic">
            {errorMessage}
            {spinner}
            {content}
            <a href="#" className="single-comic__back">Back to all</a>
        </div>
    )
}

const View = ({comics}) => {
    const {title, thumbnail, description, pageCount, language, price} = comics;

    return(
        <>
        <img src={thumbnail} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
        </>
    )
}

export default SingleComics;