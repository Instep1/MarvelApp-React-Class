import './singleComicsPage.scss';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMesage from '../errorMessage/ErrorMessage';

const SingleComicsPage = () => {

    const {comicsId} = useParams();

    const [comics, setComics] = useState({});

    const {loading, error, getComics} = useMarvelService();

    useEffect(() => {
        onRequest()
    }, [comicsId])

    const onComicsLoaded = (comics) => {
        setComics(comics);
    }

    const onRequest = () => {
        getComics(comicsId)
            .then(onComicsLoaded)
    }

    const errorMessage = error ? <ErrorMesage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View comics={comics} /> : null;

    return (
        <>
        {errorMessage}
        {spinner}
        {content}
        </>            
    )
}

const View = ({comics}) => {
    const {title, thumbnail, description, pageCount, language, price} = comics;

    return(
        <div className="single-comic">
        <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to='/comics' className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicsPage;