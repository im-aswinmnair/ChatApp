function openform(){
    document.getElementById('profileModal').style.display="block"
    userdeatiles();
}



function closemodal(){
    document.getElementById('profileModal').style.display="none"
}


async function userdeatiles() {
     try{
        const response=await fetch("/Chat/getCurrentUser");
        const user = await response.json();
        console.log("user name",user.username);
        document.getElementById('profilePic').src =  `/images/${user.image}` ; 
        document.getElementById("profileName").textContent = user.username;
        document.getElementById('profileEmail').textContent=user.email;
        document.getElementById('profileBio').textContent=user.bio;
         
     }catch(error){
             console.error(error)
     }

}