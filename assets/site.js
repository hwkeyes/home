document.querySelectorAll('[data-year]').forEach((item)=>{item.textContent=new Date().getFullYear();});
document.querySelectorAll('[data-whatsapp-form]').forEach((form)=>{
 form.addEventListener('submit',(event)=>{
  event.preventDefault();
  const data=new FormData(form);
  const message=['Hello Hawk Eyes, I would like to request a consultation.','Name: '+data.get('name'),'Telephone: '+data.get('phone'),'Postcode: '+data.get('postcode'),'Service: '+data.get('service'),'Support route: '+data.get('supportType'),'Preferred time: '+(data.get('time')||'Flexible'),'Details: '+(data.get('details')||'I will explain when contacted.')].join('\n');
  const url='https://wa.me/447375669959?text='+encodeURIComponent(message);
  window.open(url,'_blank','noopener,noreferrer');
  let fallback=form.querySelector('.enquiry-fallback');
  if(!fallback){
   fallback=document.createElement('div');fallback.className='enquiry-fallback';
   const link=document.createElement('a');link.className='text-link';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open your prepared WhatsApp message ↗';fallback.append(link);
   const label=document.createElement('label');label.textContent='Your prepared message (you can select and copy it)';
   const text=document.createElement('textarea');text.readOnly=true;text.rows=8;label.append(text);fallback.append(label);
   const copy=document.createElement('button');copy.type='button';copy.className='button button-outline';copy.textContent='Copy message';fallback.append(copy);
   const status=document.createElement('p');status.setAttribute('role','status');fallback.append(status);
   copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text.value);status.textContent='Message copied. Paste it into WhatsApp when you are ready.';}catch(error){text.focus();text.select();status.textContent='Select the message and copy it using your device’s copy command.';}});
   form.append(fallback);
  }
  fallback.querySelector('a').href=url;fallback.querySelector('textarea').value=message;fallback.querySelector('[role="status"]').textContent='';
  const status=form.querySelector('.form-success');if(status)status.hidden=false;
 });
});
