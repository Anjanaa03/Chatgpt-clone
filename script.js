const app = document.querySelector('.app'),
mode=document.querySelector('#mode'),
chats=document.querySelector('.chats'),
add_chat=document.querySelector('#add-chat'),
clear=document.querySelector('#delete'),
qna=document.querySelector('.qna'),
input=document.querySelector('.request input'), 
send=document.querySelector('#send'),
OPENAI="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",
url="https://api.openai.com/v1/chat/completions";

mode.addEventListener('click',toggleMode);
add_chat.addEventListener('click',addNewChat);

send.addEventListener('click',getAnswer);
input.addEventListener('keyup',(e)=>{
       if(e.key ==='Enter'){
              getAnswer();
       }
}
);

clear.addEventListener('click',() => chats.innerHTML='');
function toggleMode(){
       const light_mode = app.classList.contains('light');
       app.classList.toggle('light',!light_mode);
   mode.innerHTML=`<iconify-icon icon="bi:${light_mode?'brightness-high':'moon'}" class="icon"></iconify-icon>${light_mode?'Light mode':'Dark mode'}`;
}
function addNewChat(){
       chats.innerHTML+= `
       <li>
       <div>
           <iconify-icon icon="bi:chat-left" class="icon"></iconify-icon>
           <span class="chat-title" contenteditable> New Chat</span> 
           </div>
           <div>
           <iconify-icon icon="bi:trash3" class="icon" onclick="removeChat(this)" ></iconify-icon>
           <iconify-icon icon="bi:pen" class="icon" onclick="updateChatTitle(this)"></iconify-icon>
       </div>  
    </li>            
       `;
}

const removeChat = (el)=> el.parentElement.parentElement.remove();
const updateChatTitle = (el) => el.parentElement.previousElementSibling.lastElementChild.focus();

async function getAnswer(){
       const options = {
              method : 'POST' , 
              headers : {
                     'Content-Type': 'application/json' ,
                      'Authorization': 'Bearer ${OPENAI}', 
              },
              body : JSON.stringify({
                     model: "gpt-3.5-turbo",
                     messages: [{role: "user", content:"hello!"}],
                     max_tokens:100
              })
       }
       try{
        const id = generateId();
        const question =input.value;
         app.querySelector('.hints p').innerHTML=question;
         qna.innerHTML+=createChat(question,id);

         const p = document.getElementById(id);
       const res= await fetch(url,options);

         if(res.ok){
              p.innerHTML="";
              input.value="";
              const data = await res.json();
              console.log(data);
              const msg = data.choices[0].message.content
              typeWriter (p,msg);
         }
       }
       catch(err){
              console.error(err);
       }
}

function createChat(question,id){
       return(
              ` 
          <div class="result">
              <div class="question">
               <iconify-icon icon="bi:person-fill-gear" class="icon black"></iconify-icon>
               <p>${question}</p>
              </div>
              <div class="answer">
               <iconify-icon icon="bi:robot" class="icon grey"></iconify-icon>
               <p  id="${id}"><img src="loading.gif" class="loading" /></p>
               
              </div>
         </div>
         `
       );
 
}
function generateId(){
   const id = Math.random.toString(16) + Date.now();
   return id.substr(2,id.length-2); 
}

function typeWriter(el , ans){
      let i = 0 ,
      interval=setInterval(()=>{
        qna.scrollTop =  qna.scrollHeight;
         if(ans.length>i){
              el.innerHTML+=ans.charAt(i);
              i++;
         }else{
              clearInterval(interval)
         } 
      },50)
}
