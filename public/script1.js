const login=document.querySelector(".loginbtn")
    login.addEventListener('click',(event)=>{
      login.style.fontSize="10px"
      event.preventDefault();
      login.style.fontSize="13px"
      window.location.href="/login";
    })
    login.addEventListener('mouseover',()=>{
        login.style.padding="10px";
    })
    login.addEventListener('mouseout',()=>{
        login.style.padding="7px";
    })