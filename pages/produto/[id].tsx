import Layout from "../../components/Layout";
import dynamic from "next/dynamic";
import axios from 'axios';
import { builderHeader } from "../../helpers/header";

const ProductContent = dynamic(() => import("../../components/Pages/Product"), {
  ssr: false,
});

export default function ProductPage({
  user,
  categories,
  products,
  product,
}: any) {
  return (
    <Layout user={user} menus={categories}>
      <ProductContent products={products} product={product} />
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {
    const product_categories = "masculino";
    const id = context.params.id;
    const headers = builderHeader(context);
    if (headers) {
      try {
        const response = await axios.get(`${process.env.URL}/platform/me`, headers)
        user = response.data
      } catch (err) {
        context.res.setHeader('Set-Cookie', `authToken=; HttpOnly; Path=/;`);
        console.log(err)
      }
    } 
    const [categories, products, product] = await Promise.all([
      axios.get(`${process.env.URL}/platform/get-categories`, headers),      
      axios.post(`${process.env.URL}/platform/list-products`, {
        product_categories,
      }, headers),
      axios.get(`${process.env.URL}/platform/product-by-id/${id}`, headers),
    ]);

    return {
      props: {
        categories: categories.data,
        products: products.data,
        product: product.data,
        user,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        categories: [],
        products: [],
        product: null,
        user,
      },
    };
  }
}
