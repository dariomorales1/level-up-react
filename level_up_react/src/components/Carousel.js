import React from 'react';
import '../styles/components/carouselStyles.css';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import banner1 from '../assets/img/banner/banner1.jpg';
import banner2 from '../assets/img/banner/banner2.jpg';
import banner3 from '../assets/img/banner/banner3.jpg';
import banner4 from '../assets/img/banner/banner4.png';

export default function MyCarousel () {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src={banner1}
                alt="Primera imagen"
                />
            </Carousel.Item>
            
            <Carousel.Item>
                <img
                className="d-block w-100"
                src={banner2}
                alt="Segunda imagen"
                />
            </Carousel.Item>

            <Carousel.Item>
                <img
                className="d-block w-100"
                src={banner3}
                alt="Tercera imagen"
                />
            </Carousel.Item>

            <Carousel.Item>
                <img
                className="d-block w-100"
                src={banner4}
                alt="Cuarta imagen"
                />
            </Carousel.Item>
            </Carousel>
    );
};
