const product=document.getElementById("product");
const sellPrice=document.getElementById("sell_price");
const total=document.getElementById("total");

document.addEventListener("DOMContentLoaded", getProducts());
function handleFormSubmit(){
    event.preventDefault();
    const productData={
        selling_price:event.target.selling_price.value,
        product_name:event.target.product_name.value
    }
    addProduct(productData);
    product.value="";
    sellPrice.value="";
}

function addProduct(productData){
    axios
    .post("https://crudcrud.com/api/ed3fd2f33a7c4bb18cf5193e6d41c1b2/sellerAdmin",productData)
    .then((res)=>displayProductDetails(res.data))
    .catch((error)=>console.log(error));
}

function displayProductDetails(productDetails){
    const productsList=document.getElementById("products");
    const li=document.createElement("li");
    li.setAttribute("class", "list-group-item col-7 p-2");
    li.textContent=`${productDetails.selling_price} - ${productDetails.product_name} - `;

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="Delete Product";
    deleteBtn.setAttribute("value", productDetails._id);
    deleteBtn.setAttribute("class", "btn btn-sm btn-danger");
    li.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function(){
        const productToDelete=event.target.parentElement;
        deleteProduct(productsList, productDetails, productToDelete);
    });

    productsList.appendChild(li);
    total.innerHTML=Number(total.innerHTML)+Number(productDetails.selling_price);
    
}
function displayAllProducts(productsArr){
    let sum=0;
    for(let i=0;i<productsArr.length;i++){
        displayProductDetails(productsArr[i]);
        sum=sum+Number(productsArr[i].selling_price);
    }
    total.innerHTML=sum;
}
function getProducts(){
    axios.get("https://crudcrud.com/api/ed3fd2f33a7c4bb18cf5193e6d41c1b2/sellerAdmin")
    .then((res)=>displayAllProducts(res.data))
    .catch((error)=>console.log(error));
}

function deleteProduct(productsList, productDetails, productToDelete){
    axios.delete(`https://crudcrud.com/api/ed3fd2f33a7c4bb18cf5193e6d41c1b2/sellerAdmin/${productDetails._id}`)
    .then((res)=>{
        productsList.removeChild(productToDelete);
        total.innerHTML=Number(total.innerHTML)-Number(productDetails.selling_price);
    })
    .catch((error)=>console.log(error));
}