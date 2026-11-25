import HeroHome from "../../components/home/HeroHome";
import Categories from "../../components/home/Сategories";
import Company from "../../components/header/Company";
import Collaboration from "../../components/home/Collaboration";
import TopJobs from "../../components/home/TopJobs";
import UkrainianCompanies from "../../components/home/UkrainianCompanies";
import BusinessMatchRoute from "../../components/home/BusinessMatchRoute";
import NetworkPeople from "../../components/home/NetworkPeople";
import ProductsServices from "../../components/home/ProductsServices";
import WorldCities from "../../components/home/WorldCities";

export default function Home(){
    return(
        <>
            <HeroHome />
            <Categories />
            <Collaboration />
            <Company />
            <TopJobs />
            <UkrainianCompanies />
            <BusinessMatchRoute />
            <NetworkPeople />
            <ProductsServices />
            <WorldCities />
        </>
    )
}