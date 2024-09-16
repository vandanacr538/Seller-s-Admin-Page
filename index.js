const url="https://crudcrud.com/api/5a5f11ce91f44d579d510933a15589f2"
const product=document.getElementById("product");
const sellPrice=document.getElementById("sell_price");
const total=document.getElementById("total");
const addBtn=document.getElementById("add-btn");
const form=document.querySelector("form");
let oldPrice=0;

document.addEventListener("DOMContentLoaded", getProducts());
function handleFormSubmit(){
    event.preventDefault();
    const productData={
        selling_price:event.target.selling_price.value,
        product_name:event.target.product_name.value
    }
    if(addBtn.innerHTML=="Add Product"){
        addProduct(productData);
    }
    else{
        editProduct(productData, addBtn.value);
    }
    product.value="";
    sellPrice.value="";
}

function addProduct(productData){
    axios
    .post(`${url}/sellerAdmin`,productData)
    .then((res)=>displayProductDetails(res.data))
    .catch((error)=>console.log(error));
}

function createDeleteButton(productDetails, list, productsList){
    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="Delete Product";
    deleteBtn.setAttribute("value", productDetails._id);
    deleteBtn.setAttribute("class", "btn btn-sm btn-danger");
    list.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function(){
        const productToDelete=event.target.parentElement;
        deleteProduct(productsList, productDetails, productToDelete);
    });
}

function createEditButton(productDetails, li){
    const editBtn=document.createElement("button");
    editBtn.textContent="Edit Product";
    editBtn.setAttribute("value", productDetails._id);
    editBtn.setAttribute("class", "btn btn-sm btn-warning m-1");
    li.appendChild(editBtn);

    editBtn.addEventListener("click", function(){
        sellPrice.value=productDetails.selling_price;
        product.value=productDetails.product_name;
        addBtn.innerHTML="Update Product";
        addBtn.setAttribute("value", productDetails._id);
        oldPrice=productDetails.selling_price;
        if(!document.getElementById("cancel-edit")){
            const cancelBtn=document.createElement("button");
            cancelBtn.textContent="Cancel";
            cancelBtn.setAttribute("class", "btn btn-secondary");
            cancelBtn.setAttribute("id", "cancel-edit");
            form.appendChild(cancelBtn);

            cancelBtn.addEventListener("click", function(){
                sellPrice.value="";
                product.value="";
                cancelBtn.style.display="none";
                addBtn.innerHTML="Add Product";
            });
        }
        else if(document.getElementById("cancel-edit").style.display=="none"){
            document.getElementById("cancel-edit").style.display="block";
        }
    });
}

function displayProductDetails(productDetails){
    const productsList=document.getElementById("products");
    const li=document.createElement("li");
    li.setAttribute("class", "list-group-item col-7 p-2");

    const dataSpan=document.createElement("span");
    dataSpan.textContent=`${productDetails.selling_price} - ${productDetails.product_name} - `;
    dataSpan.setAttribute("id", productDetails._id);
    li.appendChild(dataSpan);

    createDeleteButton(productDetails, li, productsList);
    createEditButton(productDetails, li);
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
    axios.get(`${url}/sellerAdmin`)
    .then((res)=>displayAllProducts(res.data))
    .catch((error)=>console.log(error));
}

function deleteProduct(productsList, productDetails, productToDelete){
    axios.delete(`${url}/sellerAdmin/${productDetails._id}`)
    .then((res)=>{
        productsList.removeChild(productToDelete);
        total.innerHTML=Number(total.innerHTML)-Number(productDetails.selling_price);
    })
    .catch((error)=>console.log(error));
}

function editProduct(productDetails, productID){
    axios.put(`${url}/sellerAdmin/${productID}`, productDetails)
    .then((res)=>{
        const updatedData=JSON.parse(res.config.data);
        document.getElementById(productID).innerHTML=`${updatedData.selling_price} - ${updatedData.product_name} - `;
        if(oldPrice>0){
            total.innerHTML=Number(total.innerHTML)-Number(oldPrice)+Number(productDetails.selling_price);
        }
        addBtn.innerHTML="Add Product";
        document.getElementById("cancel-edit").style.display="none";
    }
    )
    .catch((error)=>console.log(error));
}
