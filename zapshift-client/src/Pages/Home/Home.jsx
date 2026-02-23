import React from 'react';
import Banner from './Banner';
import Services from './ServiceSection/Services';
import ClientsMarquee from './LogoMarque/ClientsMarquee';
import ServiceHighlights from './ServiceHighlight/ServiceHighlights';
import Bmerchent from './BMerchent/Bmerchent';
import Testimonials from './Customer/Testimonials';
import Faq from './FAQ/Faq';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services></Services>
            <ClientsMarquee></ClientsMarquee>
            <ServiceHighlights></ServiceHighlights>
            <Bmerchent></Bmerchent>
            <Testimonials></Testimonials>
            <Faq></Faq>
        </div>
    );
};

export default Home;