self.addEventListener("fetch",(e) => {
 if (e.request.url === "https://zippcodder.github.io/inkpad/pages/index.html") {
	e.respondWith(new Promise((res,rej) => { 
   res(new Response("Herh",{status: 200}));
 }));
 }
});
