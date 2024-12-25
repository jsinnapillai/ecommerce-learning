 
import ProductList from "@/components/product/product-list";
 

import sampleData from "@/db/sample-data";
import { getLatestProducts } from "@/lib/actions/product.action";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const metadata = {
  title:'Home'
}

const  Home = async () => {
  const latestProducts = await getLatestProducts();
  console.log(sampleData);

  // await delay(1000);
  return (  <>
    <ProductList data={latestProducts} title="Newest Arrivals" /> 
    </>)
}

export default Home;