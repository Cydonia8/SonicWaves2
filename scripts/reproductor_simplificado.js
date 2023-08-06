"use strict"
const main_content = document.getElementById("main-content-dynamic-container")
const loader = document.querySelector("#loader")
const link_inicio = document.getElementById("home-link")
const arrow_show_aside = document.getElementById("arrow-show-aside")
const header_aside = document.getElementById("side-menu")
const search_bar = document.getElementById("search-bar")
const lista_recomendada = document.getElementById("lista-recomendada")


//API Key
const MXMATCH_API_KEY = "230777d3bbd468016bc464b2a53b4c22"

//Elementos de la barra de reproducción
const seek = document.getElementById("seek")
const bar2 = document.getElementById("bar2")
const dot = document.querySelector(".master-play .time-bar .dot")
const volume_input = document.getElementById("volume-slider")
const volume_bar = document.querySelector(".vol-bar")
const volume_dot = document.querySelector(".vol-dot")
const volume_icon = document.querySelector(".volume-icon")
const track_info = document.querySelector(".track-info")
const player_logo = document.querySelector(".player-logo-color-changer")
const next = document.getElementById("next")
const previous = document.getElementById("previous")
const shuffle = document.getElementById("shuffle")
// const letra = document.getElementById("letra")
const play_pause = document.getElementById("play-pause")

//Elementos relativos al tiempo
const current_time = document.getElementById("current-time")
const end_time = document.getElementById("end-time")
const audio = document.querySelector("audio")


//Elementos del ecualizador
// const context = new AudioContext()
// const lowFilter = new BiquadFilterNode(context,{type:'lowshelf',frequency:100})
// const midLowFilter = new BiquadFilterNode(context,{type:'peaking',frequency:400,Q:3})
// const midFilter = new BiquadFilterNode(context,{type:'peaking',frequency:400,Q:3})
// const midHighFilter = new BiquadFilterNode(context,{type:'peaking',frequency:800,Q:3})
// const highFilter = new BiquadFilterNode(context,{type:'highshelf',frequency:1600})
// const finalGain = new GainNode(context)

//Cola reproducción que contendrá las canciones que se irán reproduciendo
let cola_reproduccion = []
//Indice de canción que se está reproduciendo
let indice=0

let ultimo_indice
//Variable para controlar el aleatorio
let shuffle_state = false


//Listener que activa el aleatorio
shuffle.addEventListener("click", activateShuffle)

//Listener que genera una lista de canciones recomendadas
lista_recomendada.addEventListener("click", (evt)=>{
    evt.preventDefault()
    loadShufflePlayingList()
})


//Función encargada de activar o desactivar el aleatorio
function activateShuffle(){
    if(shuffle.classList.contains("shuffle-active")){
        shuffle.classList.remove("shuffle-active")
        shuffle_state = false
    }else{
        shuffle.classList.add("shuffle-active")
        shuffle_state = true
    }

}


//Listener para visualizar la letra de la canción actual
// letra.addEventListener("click", async()=>{
//     const titulo = track_info.children[1].children[0].innerText
//     const artista = track_info.children[1].children[1].innerText
//     const foto = track_info.children[0].src

//     const respuesta = await fetch(`http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_artist=${artista}&q_track=${titulo}&apikey=${MXMATCH_API_KEY}`)
//     const datos = await respuesta.json()
  
//     let letra
//     let copyright
//     if("lyrics" in datos.message.body){
//         letra = datos.message.body.lyrics.lyrics_body
//         copyright = datos.message.body.lyrics.lyrics_copyright
//         //Eliminamos la advertencia de uso comercial
//         letra = letra.replace("******* This Lyrics is NOT for Commercial use *******", "Pronto, letras completas en Sonic Waves")
//     }
    
//     //Manejamos cada uno de los supuestos
//     if(letra == "" && copyright == ""){
//         letra = "Instrumental. Disfruta de la música"
//     }else if(letra == "" && copyright == "Unfortunately we're not authorized to show these lyrics."){
//         letra = "No nos dejan mostrar esta letra por copyright. Capitalismo."
//     }else if(datos.message.header.status_code == "404"){
//         letra = "Actualmente no disponemos de esta letra, lo sentimos."
//     }

//     main_content.innerHTML=`<section class="container-fluid rounded h-100 mx-auto d-flex flex-column justify-content-center align-items-center lyrics-container">
//                             <h1 class='text-center mt-3 mb-3'>${titulo}</h1>
//                             <h2 class='text-center mb-3'>${artista}</h2>
//                             <canvas></canvas>
//                             <pre class="text-center" id="song-lyric">${letra}</pre>
//                         </section>`
//     const canvas = main_content.querySelector("canvas")
//     const lyrcs_container = main_content.querySelector(".lyrics-container")
//     const img = document.createElement("img")
//     canvas.width='300'
//     canvas.height='300'
//     img.src=`${foto}`
//     img.width='300px'
//     img.height='300px'
//     let ctxt = canvas.getContext("2d")
//     canvas.style.display="none"
//     ctxt.drawImage(img, 0, 0, 300, 3000)
//     const image_data = ctxt.getImageData(0,0,canvas.width, canvas.height)
//     let rgb_array = buildRGBArray(image_data.data)
//     const quantColors = quantization(rgb_array, 0)
//     quantColors.sort((a,b) => a-b)
//     let color1 = quantColors[quantColors.length-1]
//     let color2 = quantColors[quantColors.length-8]
//     let color3 = quantColors[quantColors.length-4]
//     let color4 = quantColors[quantColors.length-11]
//     let color5 = quantColors[quantColors.length-14]
//     lyrcs_container.style.background=`linear-gradient(250deg, rgba(${color1.r},${color1.g},${color1.b},.5) 40%, rgba(${color3.r},${color3.g},${color3.b},0.6500175070028011) 50% , rgba(${color2.r}, ${color2.g}, ${color2.b}, .85), rgba(${color5.r},${color5.g},${color5.b},1) 100%)`

// })


search_bar.addEventListener("keyup", async ()=>{
    const busqueda = search_bar.value

    // loader.classList.add("d-flex")
    // loader.classList.remove("d-none")
    const respuesta = await fetch(`../api_audio/busqueda.php?patron=${busqueda}`)
    const datos = await respuesta.json()
    // loader.classList.add("d-none")
    // loader.classList.remove("d-flex")
    main_content.classList.remove("position-absolute")
    main_content.innerHTML=""
    main_content.innerHTML="<div class='d-flex justify-content-center mb-3'><img src='../media/assets/sonic-waves-high-resolution-logo-color-on-transparent-background (1).png' class='w-25 mx-auto'></div>"

    const albumes = datos["albumes"]
    const grupos = datos["grupos"]
    const canciones = datos["canciones"]

    const resultados = document.createElement("section")
    resultados.classList.add("d-flex", "container-fluid", "flex-column", "flex-xl-row", "gap-3")
    const resultados_grupo = document.createElement("section")
    resultados_grupo.classList.add("d-flex", "flex-column", "groups-search-results", "gap-3")
    resultados_grupo.innerHTML=`<h2 class="text-center">Artistas</h2>`
    if(grupos.length != 0){
        grupos.forEach(grupo=>{
            let disco = grupo.discografica == 0 ? '' : 'Artista esencial <ion-icon name="checkmark-circle-outline"></ion-icon>'
            const div_grupo = document.createElement("div")
            div_grupo.classList.add("d-flex", "align-items-center", "gap-3", "group-search-individual-result")
            div_grupo.innerHTML+=`<img src='${grupo.foto_avatar}' class="rounded-circle w-25">
                                            <h4>${grupo.nombre}</h4>
                                            <h5 class='ms-3 d-flex align-items-center gap-2 grupo-esencial-badge'>${disco}</h5>`
            div_grupo.addEventListener("click", ()=>{
                showGroup(grupo.id)
            })
            resultados_grupo.appendChild(div_grupo)
        })
    }else{
        resultados_grupo.innerHTML+="<h4 class='text-center'>Sin resultados</h4>"
    }
    
    const resultados_albumes = document.createElement("section")
    resultados_albumes.classList.add("d-flex", "flex-column", "albums-search-results")
    resultados_albumes.innerHTML=`<h2 class="text-center">Álbumes</h2>`
    if(albumes.length != 0){
        albumes.forEach(album=>{
            const div_album = document.createElement("div")
            div_album.setAttribute("data-album-id", album.id)
            div_album.classList.add("d-flex", "align-items-center", "gap-3", "album-search-individual-result")
            div_album.innerHTML+=`<img src='${album.foto}' class="w-25 rounded">
                                    <h4>${album.titulo}</h4>`
            div_album.addEventListener("click", (evt)=>{
                showAlbum(evt.currentTarget)
            })
            resultados_albumes.appendChild(div_album)
        })
    }else{
        resultados_albumes.innerHTML+="<h4 class='text-center'>Sin resultados</h4>"
    }
    const resultados_canciones = document.createElement("section") 
    resultados_canciones.classList.add("d-flex", "flex-column", "songs-search-results")
    resultados_canciones.innerHTML+=`<h2 class="text-center">Canciones</h2>`
    if(canciones.length != 0){
        canciones.forEach((cancion, index)=>{
            const div_song = document.createElement("div")
            div_song.setAttribute("data-song-id", cancion.archivo)
            div_song.classList.add("d-flex", "align-items-center", "gap-3", "song-search-individual-result")
            div_song.innerHTML=`<img src='${cancion.caratula}' class="w-25 rounded">
                                <div>
                                    <h4>${cancion.titulo}</h4>
                                    <h5>${cancion.autor}</h5>
                                    <button data-bs-auto-close="true" data-song-id=${cancion.id} class="btn-group dropup add-song-to-playlist d-flex align-items-center p-0 border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false"><ion-icon name="add-outline"></ion-icon></button>
                                            <ul class="dropdown-menu overflow-auto dropdown-menu-add-playlist">
                                            </ul>
                                </div>`
            const add_song_playlist = div_song.querySelector(".add-song-to-playlist")
            add_song_playlist.addEventListener("click", (evt)=>{
                evt.stopPropagation()
                const id_cancion = evt.currentTarget.getAttribute("data-song-id")
                const ul_container = div_song.querySelector(".dropdown-menu")
                getAllPlaylists(ul_container, "modal", id_cancion)
            })                          

            div_song.addEventListener("click", (evt)=>{
                cola_reproduccion.push(cancion)
                playSearchedSong(cancion)
            })
            resultados_canciones.appendChild(div_song)
        })
    }else{
        resultados_canciones.innerHTML+="<h4 class='text-center'>Sin resultados</h4>"
    }

    resultados.appendChild(resultados_grupo)
    resultados.appendChild(resultados_albumes)
    resultados.appendChild(resultados_canciones)
    main_content.appendChild(resultados)
})

// albums_esenciales.addEventListener("click", async (evt)=>{
//     evt.preventDefault()
//     await showFavoriteAlbums()
// })

loadShufflePlayingList()
// initializeUser()
initialVolume()
playerMainState()
// getAllPlaylists(playlists_container, "header")


arrow_show_aside.addEventListener("click", ()=>{
    if(header_aside.classList.contains("show")){
        header_aside.classList.remove("show")
        arrow_show_aside.setAttribute("name", "chevron-forward-outline")
    }else{
        header_aside.classList.add("show")
        arrow_show_aside.setAttribute("name", "chevron-back-outline")
    }
})

async function playSearchedSong(cancion){
    audio.src=`${cancion.archivo}`
    audio.play()
    play_pause.setAttribute("name", "pause-outline")
    player_logo.classList.add("active")
    track_info.innerHTML=`<img src='${cancion.caratula}' class='rounded'>
                            <div class='d-flex flex-column'>
                                <span class='track-info-title'>${cancion.titulo}</span>
                                <span class='track-info-artist'>${cancion.autor}</span>
                            </div>`
}
async function initialSong(){
    const respuesta = await fetch('../api_audio/canciones.php')
    const datos = await respuesta.json()
    let cancion = datos['datos']
    audio.src=cancion[0].archivo
    track_info.innerHTML=`<img src='${cancion[0].caratula}' class='rounded'>
                            <div class='d-flex flex-column'>
                                <span class='track-info-title'>${cancion[0].titulo}</span>
                                <span class='track-info-artist'>${cancion[0].grupo}</span>
                            </div>`
    
}



play_pause.addEventListener("click", ()=>{
    if(audio.paused){
        audio.play()
        play_pause.setAttribute("name", "pause-outline")
        player_logo.classList.add("active")
    }else{
        audio.pause()
        play_pause.setAttribute("name", "play-outline")
        player_logo.classList.remove("active")
    }
})
link_inicio.addEventListener("click", (evt)=>{
    evt.preventDefault()
    playerMainState()
})

async function playerMainState(){
    main_content.innerHTML=''
    main_content.classList.remove("position-absolute")
    loader.classList.remove("d-none")
    loader.classList.add("d-flex")
    const respuesta = await fetch("../api_audio/player_main_state.php")
    const datos = await respuesta.json()
    loader.classList.remove("d-flex")
    loader.classList.add("d-none")
    
    const recomendado = {
        foto: datos["grupo_recomendado"],
        id: datos["id_grupo_recomendado"],
        nombre: datos["nombre_grupo_recomendado"],
        discografica: datos["discografica"]
    }
    let disco = 'Grupo <ion-icon name="checkmark-circle-outline"></ion-icon>'
    const banner_main = document.createElement("div")
    banner_main.classList.add("banner-recomended", "mx-auto", "d-flex", "align-items-center", "flex-column", "justify-content-end", "position-relative", "mb-4")
    banner_main.setAttribute("data-artist-id", recomendado.id)
    banner_main.innerHTML=`<h2 class='recomended-group-name mb-0'>${recomendado.nombre}</h2>
    <h5 class='ms-3 d-flex align-items-center gap-2 grupo-esencial-badge'>${disco}</h5>`
    
    banner_main.style.backgroundImage=`url('${recomendado.foto}')`
    banner_main.style.backgroundSize='cover'
    banner_main.style.backgroundPosition='center'
    banner_main.style.height='40vh'
   
    main_content.appendChild(banner_main)
    
    const main_albums_container = document.createElement("div")
    main_albums_container.classList.add("main-content-albums-container", "container-fluid", "d-flex", "flex-column", "flex-lg-row", "gap-3", "mb-5")
    main_content.innerHTML+=`<h2 class='ms-4'>Álbumes populares</h2>`
    main_content.appendChild(main_albums_container)
    const main_content_albums_container = main_content.querySelector(".main-content-albums-container")
    datos["datos"].forEach(disco=>{
        const div_album_container = document.createElement("div")
        div_album_container.classList.add("d-flex", "flex-column", "justify-content-around", "album-inner-container")
        div_album_container.setAttribute("data-album-id", disco.id)
        div_album_container.innerHTML= `<img src='${disco.foto}' class='img-fluid mb-1 rounded'>
        <a>${disco.titulo}</a>
        <span class='artist-link' data="${disco.grupo_id}">${disco.autor}</span>`

        
        main_content_albums_container.appendChild(div_album_container)       
    })
    
    const main_artists_container = document.createElement("div")
    main_artists_container.classList.add("d-flex", "flex-column", "flex-lg-row", "gap-3", "main-content-artists-container", "container-fluid")
    main_content.innerHTML+=`<h2 class='ms-4 mt-3'>Artistas populares</h2>`
    main_content.appendChild(main_artists_container)
    const main_content_artists_container = main_content.querySelector(".main-content-artists-container")
    datos["artistas"].forEach(artista=>{
        const div_artist_container = document.createElement("div")
        div_artist_container.setAttribute("data-artist-id", artista.id)
        div_artist_container.addEventListener("click", ()=>{
            showGroup(artista.id)
        })
        div_artist_container.classList.add("d-flex", "flex-column", "justify-content-around", "artist-inner-container")   
        div_artist_container.innerHTML=`<img src='${artista.foto_avatar}' class='img-fluid rounded-circle'>
        <a class='text-center text-white'>${artista.nombre}</a>`
        main_content_artists_container.appendChild(div_artist_container)
    })

    const estilo_r1 = datos["estilo_random1"]
    const albums_estilo_r1 = datos["albums_estilo_r1"];

    const albums_random1 = document.createElement("div")
    albums_random1.classList.add("d-flex", "flex-column", "flex-lg-row", "justify-content-start", "gap-3", "main-content-artists-container", "container-fluid")
    main_content.innerHTML+=`<h2 class='ms-4 mt-3'>Álbumes recomendados de ${estilo_r1}</h2>`
    albums_estilo_r1.forEach(album=>{
        const div_album_r1_container = document.createElement("div")
        div_album_r1_container.classList.add("d-flex", "flex-column", "justify-content-around", "album-inner-container")
        div_album_r1_container.setAttribute("data-album-id", album.id)
        div_album_r1_container.innerHTML=`<img src='${album.foto}' class='img-fluid mb-1 rounded'>
        <a>${album.titulo}</a>
        <span class='artist-link' data="${album.grupo_id}">${album.autor}</span>`
        albums_random1.appendChild(div_album_r1_container)
    })
    main_content.appendChild(albums_random1)
    const pubs_random = datos["publicaciones_random"]
    console.log(pubs_random)
    main_content.innerHTML+="<h2 class='ms-4 mt-3'>Consulta algunas de nuestras publicaciones exclusivas</h2>"
    const div_publis = document.createElement("div")
    div_publis.classList.add("d-flex", "flex-column", "p-3", "gap-3", "initial-state-pubs-container")
    pubs_random.forEach(pub=>{
        const div_pub = document.createElement("div")
        div_pub.classList.add("d-flex", "gap-3")
        div_pub.innerHTML=`<img src='${pub.foto}' class='img-pub-initial-state'>
                            <div class='p-1 d-flex flex-column align-items-start gap-2'>
                                <h3>${pub.titulo}</h3>
                                <h4>${pub.grupo}</h4>
                                <i>${formatDate(pub.fecha)}</i>
                                <button type="button" style='--clr:#0ce8e8' class='btn-danger-own'><span>Ver completa</span><i></i></button>
                            </div>`
        const ver_publicacion = div_pub.querySelector("button")
        ver_publicacion.addEventListener("click", ()=>{
            watchFullPost(pub.id)
        })
        div_publis.appendChild(div_pub)
    })
    main_content.appendChild(div_publis)
}

async function initializePlayer(evt){
    evt.preventDefault()
}

//Actualizar tiempo actual de la canción
audio.addEventListener("timeupdate", ()=>{
    let current_minutos = Math.floor(audio.currentTime/60)
    let current_segundos = Math.floor(audio.currentTime - current_minutos * 60)

    let width = parseFloat(audio.currentTime / audio.duration * 100)
    seek.value = width
    bar2.style.width=`${width}%`
    dot.style.left=`${width}%`
    if(current_segundos < 10){
        current_segundos = `0${current_segundos}`
    }
    current_time.innerText=`${current_minutos}:${current_segundos}`
})

document.addEventListener("click", (evt)=>{
    const target = evt.target.closest(".album-inner-container"); // Or any other selector.  
    if(target){
      showAlbum(target)
    }
  })

document.addEventListener("click", (evt)=>{
    const target = evt.target.closest(".banner-recomended"); // Or any other selector.
    if(target){
        const id = target.getAttribute("data-artist-id")
        showGroup(id)
    }
})

document.addEventListener("click", (evt)=>{
    const target = evt.target.closest(".artist-inner-container"); // Or any other selector.
    if(target){
        const id = target.getAttribute("data-artist-id")
        showGroup(id)
    }
})

//Actualizar duración total de la canción
audio.addEventListener("loadedmetadata", ()=>{
    seek.max=audio.duration
    let duracion_min = Math.floor(audio.duration/60)
    let duracion_segundos = Math.floor(audio.duration - duracion_min * 60);
    if(duracion_segundos < 10){
        duracion_segundos = `0${duracion_segundos}`
    }   
    end_time.innerText=`${duracion_min}:${duracion_segundos}`
})


seek.addEventListener("input", ()=>{
    audio.currentTime=seek.value
})

audio.addEventListener("ended", ()=>{
    bar2.style.width='0%'
    dot.style.left='0'
    current_time.innerText='0:00'
    end_time.innerText='0:00'
    play_pause.setAttribute("name", "play-outline")
    if(!shuffle_state){
        indice++
    }else{
        indice = Math.floor(Math.random()*cola_reproduccion.length)
    }
    
    const row_album = document.querySelectorAll(".cancion-row")
    let arr = Array.from(row_album)
    const filtro = arr.filter(cont=>cont.children[0].children[0].innerText == indice+1)
    if(indice < cola_reproduccion.length){
        if(filtro.length != 0){
            arr.forEach(item=>{
                item.children[0].children[1].classList.remove("current-song-playing")
            })
            filtro[0].children[0].children[1].classList.add("current-song-playing")
        }
        playSong(indice)
    }
})
next.addEventListener("click", ()=>{
    if(!shuffle_state){
        indice++
    }else{
        ultimo_indice = indice
        indice = Math.floor(Math.random()*cola_reproduccion.length)
    }
    
    const row_album = document.querySelectorAll(".cancion-row")

    let arr = Array.from(row_album)
    const filtro = arr.filter(cont=>cont.children[0].children[0].innerText == indice+1)
    
    if(indice < cola_reproduccion.length){
        if(filtro.length != 0){
            arr.forEach(item=>{
                item.children[0].children[1].classList.remove("current-song-playing")
            })

            if(filtro[0].children[0].children[1].children[0].innerText == cola_reproduccion[indice].titulo){
                filtro[0].children[0].children[1].classList.add("current-song-playing")
            }
            
        }
        playSong(indice)
    }else{
        indice = 0
        if(row_album.length != 0){
            row_album.item(row_album.length-1).children[0].children[1].classList.remove("current-song-playing")
            row_album.item(0).children[0].children[1].classList.add("current-song-playing")
        }
        playSong(indice)
    }
})
previous.addEventListener("click", ()=>{
    if(!shuffle_state){
        indice--
    }else{
        indice = ultimo_indice
    }
    
    const row_album = document.querySelectorAll(".cancion-row")
    let arr = Array.from(row_album)
    const filtro = arr.filter(cont=>cont.children[0].children[0].innerText == indice+1)
    if(indice >= 0){
        if(filtro.length != 0){
            arr.forEach(item=>{
                item.children[0].children[1].classList.remove("current-song-playing")
            })
            if(filtro[0].children[0].children[1].children[0].innerText == cola_reproduccion[indice].titulo){
                filtro[0].children[0].children[1].classList.add("current-song-playing")
            }
        }
        playSong(indice)
    }else{
        indice = 0
        playSong(indice)
    }
})

volume_input.addEventListener("input", ()=>{
    let valor = volume_input.value
    audio.volume=valor
    let width = valor*100
    volume_bar.style.width=`${width}%`
    volume_dot.style.left=`${width}%`
    if(audio.volume > 0 && audio.volume <= .25){
        volume_icon.setAttribute("name","volume-low-outline")
    }else if(audio.volume > .25 && audio.volume < .75){
        volume_icon.setAttribute("name", "volume-medium-outline")
    }else if(audio.volume >= .75){
        volume_icon.setAttribute("name", "volume-high-outline")
    }else{
        volume_icon.setAttribute("name", "volume-mute-outline")
    }
})


function initialVolume(){
    document.addEventListener("DOMContentLoaded", ()=>{
        audio.volume='0.5'
        volume_bar.style.width=`50%`
        volume_dot.style.left=`50%`
    })
}
 

async function showAlbum(target){
    main_content.innerHTML=''

    loader.classList.remove("d-none")
    loader.classList.add("d-flex")
    const id = target.getAttribute("data-album-id")

    const respuesta = await fetch(`../api_audio/album_peticion.php?id=${id}`)
    const datos = await respuesta.json()
    loader.classList.add("d-none")
    loader.classList.remove("d-flex")
    
    const favorito = datos["favorito"]
    const total_canciones = datos["canciones_totales"]
   
    const datos_album = datos["datos_album"]
    const corazon = favorito == 0 ? "fa-regular" : "fa-solid"
    main_content.classList.add("position-absolute", "w-100", "top-0")
    const section_album_head = document.createElement("section")
    section_album_head.classList.add("container-fluid", "d-flex","flex-column", "flex-lg-row", "album-page-header", "gap-3", "align-items-center", "p-3")
    section_album_head.innerHTML=`<canvas></canvas>
                                    <div class='d-flex flex-column gap-3 align-items-center align-items-md-start'>
                                        <h1 class='text-sm-center'>${datos_album[0].titulo}</h1>
                                        <div class='d-flex align-items-center gap-2'>
                                            <img src='${datos_album[0].avatar}' class='avatar-album-page'>
                                            <h3 data-artist-id=${datos_album[0].id_grupo} class='m-0 album-page-artist-link'>${datos_album[0].autor}</h3>
                                        </div>
                                        <h4>Lanzado el ${formatDate(datos_album[0].lanzamiento)} · ${total_canciones} canciones</h4>
                                        <div class='d-flex gap-4'>
                                            <i data-album-id="${id}" class="fa-regular fa-comment add-album-review see-album-reviews"></i>
                                        </div>
                                    </div>`
    const canvas = section_album_head.querySelector("canvas")
    const see_reviews = section_album_head.querySelector(".see-album-reviews")
    see_reviews.addEventListener("click", async ()=>{
        await seeAlbumReviews(id)
    })
    const enlace_grupo = section_album_head.querySelector("h3")
    enlace_grupo.addEventListener("click", ()=>{
        showGroup(datos_album[0].id_grupo)
    })
    const img = document.createElement("img")
    canvas.width='300'
    canvas.height='300'
    img.src=`${datos_album[0].foto}`
    img.width='300px'
    img.height='300px'
    let ctxt = canvas.getContext("2d")
    ctxt.drawImage(img, 0, 0, 280, 280)
    const image_data = ctxt.getImageData(0,0,canvas.width, canvas.height)
    let rgb_array = buildRGBArray(image_data.data)
    const quantColors = quantization(rgb_array, 0)
    quantColors.sort((a,b) => a-b)
    let color1 = quantColors[quantColors.length-1]
    let color2 = quantColors[quantColors.length-8]
    let color3 = quantColors[quantColors.length-4]
    let color4 = quantColors[quantColors.length-11]
    let color5 = quantColors[quantColors.length-14]

    section_album_head.style.background=`linear-gradient(250deg, rgba(${color1.r},${color1.g},${color1.b},.5) 40%, rgba(${color3.r},${color3.g},${color3.b},0.6500175070028011) 50% , rgba(${color2.r}, ${color2.g}, ${color2.b}, .85), rgba(${color5.r},${color5.g},${color5.b},1) 100%)`
    main_content.appendChild(section_album_head)
    const lista_canciones = datos["lista_canciones"]
    const section_lista_canciones = document.createElement("section")
    section_lista_canciones.classList.add("p-4", "d-flex", "flex-column", "gap-3")

    lista_canciones.forEach((cancion, index)=>{
        let indice = index+1
        const cancion_container = document.createElement("div")
        cancion_container.classList.add("d-flex", "justify-content-between", "cancion-row")
        cancion_container.setAttribute("data-cancion", cancion.album)
        cancion_container.setAttribute("data-index", index)
        cancion_container.innerHTML=`<div class='d-flex gap-3 align-items-center'>
                                        <span>${indice}</span>
                                        <div>
                                            <h5 class='m-0 cancion-link'>${cancion.titulo}</h5> 
                                            <span class='track-info-artist'>${datos_album[0].autor}</span>
                                        </div>
                                                                              
                                    </div>                                    
                                    <div class='d-flex align-items-center gap-3'>
                                        <span>${cancion.duracion}</span>
                                        
                                    </div>`                                   
        cancion_container.addEventListener("click", (evt)=>{
            loadPlayingList(evt, "album")
        })     
                      
        section_lista_canciones.appendChild(cancion_container)
        
    })
    // if(datos_album[0].discografica != "Autogestionado"){
    //     main_content.innerHTML+=`<i class="album-copyright">Publicado por ${datos_album[0].discografica}, All Rights Reserved © <img src='${datos_album[0].foto_discografica}' class='rounded-circle discografica-copyright-image'></i>`
    // }else{
    //     section_lista_canciones.innerHTML+=`<i class="album-copyright">Publicado por ${datos_album[0].autor}, All Rights Reserved © <img src='${datos_album[0].avatar}' class='rounded-circle discografica-copyright-image'></i>`
    // }
    main_content.appendChild(section_lista_canciones)
    
    if(!audio.paused){
        for(const child of section_lista_canciones.children){
            if(!child.classList.contains("album-copyright")){
          
                if(child.children[0].children[1].children[0].innerText == cola_reproduccion[indice].titulo){
                    child.children[0].children[1].classList.add("current-song-playing")
                }
            }
            
        }
    }  
}


async function seeAlbumReviews(id){
    main_content.innerHTML=''
    loader.classList.remove("d-none")
    loader.classList.add("d-flex")
    
    const respuesta = await fetch(`../api_audio/album_reviews.php?id=${id}`)
    const datos = await respuesta.json()
    loader.classList.remove("d-flex")
    loader.classList.add("d-none")

    const datos_album = datos["datos_album"]
    main_content.classList.add("position-absolute", "w-100", "top-0")
    const section_album_head = document.createElement("section")
    section_album_head.classList.add("container-fluid", "d-flex","flex-column", "flex-lg-row", "album-page-header", "gap-3", "align-items-center", "p-3")
    section_album_head.innerHTML=`<canvas></canvas>
                                    <div class='d-flex flex-column gap-3'>
                                        <h1>${datos_album[0].titulo}</h1>
                                        <div class='d-flex align-items-center gap-2'>
                                            <img src='${datos_album[0].avatar}' class='avatar-album-page'>
                                            <h3 data-artist-id=${datos_album[0].id_grupo} class='m-0'>${datos_album[0].autor}</h3>
                                        </div>
                                        <h4>Lanzado el ${formatDate(datos_album[0].lanzamiento)}</h4>
                                        <div class='d-flex gap-4'>
                                      
                                            <ion-icon data-album-id="${id}"  class="album-song-list" name="musical-notes-outline"></ion-icon>
                                        </div>
                                    </div>`
    const canvas = section_album_head.querySelector("canvas")
    const album_songs = section_album_head.querySelector(".album-song-list")
    album_songs.addEventListener("click", (evt)=>{
        showAlbum(evt.target)
    })
    const enlace_grupo = section_album_head.querySelector("h3")
    enlace_grupo.addEventListener("click", ()=>{
        showGroup(datos_album[0].id_grupo)
    })
    const img = document.createElement("img")
    canvas.width='300'
    canvas.height='300'
    img.src=`${datos_album[0].foto}`
    let ctxt = canvas.getContext("2d")
    ctxt.drawImage(img, 0, 0, 280, 280)
    const image_data = ctxt.getImageData(0,0,canvas.width, canvas.height)
    let rgb_array = buildRGBArray(image_data.data)
    const quantColors = quantization(rgb_array, 0)
    quantColors.sort((a,b) => a-b)
    let color1 = quantColors[quantColors.length-1]
    let color2 = quantColors[quantColors.length-8]
    let color3 = quantColors[quantColors.length-4]
    let color4 = quantColors[quantColors.length-11]
    let color5 = quantColors[quantColors.length-13]

    section_album_head.style.background=`linear-gradient(250deg, rgba(${color1.r},${color1.g},${color1.b},.5) 40%, rgba(${color3.r},${color3.g},${color3.b},0.6500175070028011) 50% , rgba(${color2.r}, ${color2.g}, ${color2.b}, .85), rgba(${color5.r},${color5.g},${color5.b},1) 100%)`
    main_content.appendChild(section_album_head)
    // main_content.innerHTML+="<h2 class='text-center'>Reseñas de los usuarios de Sonic Waves</h2>"

    const datos_reviews = datos["reseñas"]
    
    const section_reviews = document.createElement("section")
    section_reviews.classList.add("container-fluid")
    section_reviews.innerHTML="<h2 class='text-center mt-3'>Reseñas de los usuarios de Sonic Waves</h2>"
    const reviews_container = document.createElement("div")
    reviews_container.classList.add("d-flex", "flex-column", "gap-3")
    datos_reviews.forEach(review=>{
        let fecha = formatDate(review.fecha)
        const review_cont = document.createElement("div")
        review_cont.classList.add("d-flex", "flex-column", "single-review-container", "p-2","rounded")
        review_cont.innerHTML=`<h3>${review.titulo}</h3>
                                <p>${review.contenido}</p>
                                <div class='d-flex align-items-center gap-2'>
                                    <img src='${review.foto}' class='rounded-circle see-album-reviews-avatar-user'>
                                    <i>Escrita por ${review.autor} el ${fecha}</i>
                                </div>`
                                
        // review_cont.style.background=`linear-gradient(250deg, rgba(${color1.r},${color1.g},${color1.b},.5) 40%, rgba(${color2.r}, ${color2.g}, ${color2.b}, .5), rgba(${color5.r},${color5.g},${color5.b},.5) 70%)`
        reviews_container.appendChild(review_cont)
    })
    section_reviews.appendChild(reviews_container)
    main_content.appendChild(section_reviews)
    
}

async function loadShufflePlayingList(){
    cola_reproduccion.length = 0
    const respuesta = await fetch('../api_audio/shuffle_nouser.php')
    const datos = await respuesta.json()
    const lista_aleatorio = datos["lista_aleatorio"]
    lista_aleatorio.forEach(cancion=>{
        cola_reproduccion.push(cancion)
    })
    console.log(cola_reproduccion)

    if(audio.paused){
        loadSong()
    }
    // play_pause.addEventListener("click", ()=>{
    //     if(play_pause.getAttribute("name").includes("play-outline")){
    //         playSong(indice)
    //     }
    // })
    // playSong(indice)
    // play_pause.addEventListener("click", ()=>{
    //     if(audio.paused){
    //         playSong(indice)
    //     }else{
    //         audio.pause()
    //         play_pause.setAttribute("name", "play-outline")
    //         player_logo.classList.remove("active")
    //     }
        
    // })
    
}

function loadSong(){
    audio.src=cola_reproduccion[0].archivo
    track_info.innerHTML=`<img src='${cola_reproduccion[0].caratula}' class='rounded'>
                            <div class='d-flex flex-column'>
                                <span class='track-info-title'>${cola_reproduccion[0].titulo}</span>
                                <span class='track-info-artist'>${cola_reproduccion[0].autor}</span>
                            </div>`
    bar2.style.width='0%'
    dot.style.left='0'
    current_time.innerText='0:00'
}

async function loadPlayingList(evt, context){
    let padre = evt.currentTarget.parentElement
    
    for(const child of padre.children){
        let titulo = child.children[0].children[1]
        if(titulo.classList.contains("current-song-playing")){
            titulo.classList.remove("current-song-playing")
        }
    }
    let titulo_actual = evt.currentTarget.children[0].children[1]
    titulo_actual.classList.add("current-song-playing")
    const id = evt.currentTarget.getAttribute("data-cancion")
   
    const index = evt.currentTarget.getAttribute("data-index")
    indice = index
    const respuesta = await fetch(`../api_audio/array_reproduccion.php?id=${id}&contexto=${context}`)
    const datos = await respuesta.json()
    const lista = datos["lista_canciones"]
    
    if(cola_reproduccion.length != 0){
        if(cola_reproduccion.length != lista.length){
            cola_reproduccion.length = 0
        }
        else{
            if(lista[indice].titulo != cola_reproduccion[indice].titulo){
                cola_reproduccion.length = 0
            }
        }
    }

    if(cola_reproduccion.length == 0){
        lista.forEach(cancion=>{
            cola_reproduccion.push(cancion)
        })
    }
       
    playSong(indice)
    
}

//Función que muestra todo el perfil de un grupo junto con su información
async function showGroup(id){
    main_content.innerHTML=''
    main_content.classList.add("position-absolute", "w-100", "top-0")
    loader.classList.remove("d-none")
    loader.classList.add("d-flex")
    // const id = evt.currentTarget.getAttribute("data-artist-id")
    const respuesta = await fetch(`../api_audio/artista_peticion.php?id=${id}`)
    const datos = await respuesta.json()
    loader.classList.add("d-none")
    loader.classList.remove("d-flex")
    const datos_grupo = datos["datos_grupo"]
    const discos = datos["discos_grupo"]
    // const tiene_discografica = datos_grupo[0].discografica
    let publicaciones = []
    // if(tiene_discografica == 0){
        publicaciones = datos["publicaciones_grupo"] 
        console.log(datos)
    // }
 
    let disco = 'Grupo<ion-icon name="checkmark-circle-outline"></ion-icon>'
    let header_extra = 'Publicaciones'
    const section_artist_head = document.createElement("section")
    section_artist_head.classList.add("mb-5")
    const div_artist_avatar = document.createElement("div")
    section_artist_head.innerHTML=`<div class='d-flex flex-column align-items-start'><h1 class='ms-4 section-artist-title mb-0'>${datos_grupo[0].nombre}</h1>
    <h5 class='ms-4 d-flex align-items-center grupo-esencial-badge'>${disco}</h5></div>`
    section_artist_head.classList.add("d-flex","justify-content-end", "flex-column")
    div_artist_avatar.classList.add("position-absolute")
    div_artist_avatar.style.width='100%'
    div_artist_avatar.style.height='100%'
    div_artist_avatar.innerHTML=`<img class='position-absolute rounded-circle section-artist-avatar' src='${datos_grupo[0].foto_avatar}'>`
    section_artist_head.appendChild(div_artist_avatar)
    section_artist_head.classList.add("w-100")
    section_artist_head.style.backgroundImage=`url('${datos_grupo[0].foto}')`
    section_artist_head.style.height='55vh'
    section_artist_head.style.backgroundSize='cover'
    section_artist_head.style.backgroundPosition='center'
    // section_artist_head.style.position='absolute'
    // section_artist_head.style.top='0'
    main_content.appendChild(section_artist_head)
    const section_artist_content = document.createElement("section")
    section_artist_content.classList.add("container-lg", "pt-3")
    section_artist_content.innerHTML=`<div class='d-flex flex-column flex-md-row justify-content-center gap-5 artist-section-picker mb-5 align-items-center align-items-md-start'>
                                        <h2 class="active" data-picker='bio'>Biografía</h2>
                                        <h2 data-picker='discos'>Discos publicados</h2>
                                        <h2 data-picker='pubs'>${header_extra}</h2>
                                    </div>`
    const div_artist_content = document.createElement("div")
    // div_artist_content.classList.add("d-flex", "flex-column")
    const bio = document.createElement("p")
    bio.classList.add("artist-section-bio", "options-artist")
    bio.setAttribute("data-info-artist", "bio")
    bio.innerText=`${datos_grupo[0].biografia}`
    div_artist_content.appendChild(bio)
    const div_albums_container = document.createElement("div")
    div_albums_container.classList.add("d-flex", "gap-3", "d-none", "options-artist", "flex-column", "flex-lg-row", "mb-3")
    div_albums_container.setAttribute("data-info-artist", "discos")
    if(discos.length != 0){
        discos.forEach(disco=>{
            const album = document.createElement("div")
            album.classList.add("d-flex", "gap-3", "align-items-center", "album-individual-container")
            album.setAttribute("data-album-id", disco.id)
            album.innerHTML+=`<div class='w-50'>
                                <img src='${disco.foto}' class='img-fluid object-fit-cover'>
                            </div>
                            <div class='d-flex w-50'>
                                <h5>${disco.titulo}</h5>
                            </div>`
            album.addEventListener("click", (evt)=>{
                showAlbum(evt.currentTarget)
            })
            div_albums_container.appendChild(album)
        })
    }else{
        div_albums_container.innerHTML=`<h2 class='text-center'>Este artista no tiene álbumes por el momento</h2>`
    }
    
    div_artist_content.appendChild(div_albums_container)

    const div_publicaciones = document.createElement("div")
    div_publicaciones.classList.add("d-flex", "d-none", "options-artist", "flex-column", "container-lg", "gap-4")
    div_publicaciones.setAttribute("data-info-artist", "pubs")
    // if(tiene_discografica == 0){    
        if(publicaciones.length != 0){
            publicaciones.forEach(publicacion=>{
                const div_publicacion = document.createElement("div")
                let preview_texto = publicacion.contenido.substring(0, 400)
                div_publicacion.classList.add("post-individual-container", "d-flex","gap-3", "p-3", "flex-column", "flex-md-row")
                div_publicacion.innerHTML=`<div>
                                                <img src='${publicacion.foto}' class='img-fluid'>
                                            </div>
                                            <div class='gap-2 d-flex flex-column align-items-start'>
                                                <h2>${publicacion.titulo}</h2>
                                                <p>${preview_texto}...</p>
                                                <i>${formatDate(publicacion.fecha)}</i>
                                                <button type="button" style='--clr:#0ce8e8' class='btn-danger-own'><span>Ver completa</span><i></i></button>
                                            </div>`
                const ver_publicacion = div_publicacion.querySelector("button")
                ver_publicacion.addEventListener("click", ()=>{
                    watchFullPost(publicacion.id)
                })
                div_publicaciones.appendChild(div_publicacion)
            })
        }else{
            div_publicaciones.innerHTML="<h3 class='text-center'>No hay publicaciones</h3>"
        }
        
    // }else{
    //     // await seeUpcomingEvents(datos_grupo[0].nombre, div_publicaciones)
    // }
    div_artist_content.appendChild(div_publicaciones)

    section_artist_content.appendChild(div_artist_content)
    const headers = section_artist_content.querySelectorAll("h2")
    const options = div_artist_content.querySelectorAll(".options-artist")
   
    headers.forEach(header=>{
        header.addEventListener("click", (evt)=>{
            headers.forEach(h=>h.classList.remove("active"))
            const data = evt.target.getAttribute("data-picker")
            header.classList.add("active")
      
            options.forEach(option=>{
                if(option.getAttribute("data-info-artist") == data){
                    option.classList.add("d-flex")
                    option.classList.remove("d-none")
                   
                }else{
                    option.classList.remove("d-flex")
                    option.classList.add("d-none")
                }
            })
        })
    })
    main_content.appendChild(section_artist_content)
    
}

    //Función que imprime una publicación completa
async function watchFullPost(id){
    main_content.innerHTML=""
    main_content.style.height="100vh"
    // main_content.classList.remove("position-absolute")
    const respuesta = await fetch(`../api_audio/publicacion_completa.php?id=${id}`)
    const datos = await respuesta.json()
    const datos_publicacion = datos["datos_publicacion"]
    const fotos_extra = datos["fotos_extra"]
  
    
    // main_content.innerHTML=`<button type="button" style='--clr:#0ce8e8' class='ms-3 btn-danger-own'><span>Volver al grupo</span><i></i></button>`
   
    const publicacion_container = document.createElement("section")
    publicacion_container.classList.add("container-fluid", "d-flex", "flex-column", "gap-3", "p-3", "full-post-container")
    publicacion_container.innerHTML=`   <div class='d-flex w-100 gap-3 flex-column flex-lg-row align-items-center align-items-md-start'><canvas></canvas>
                                        <img src='${datos_publicacion[0].foto}' class='rounded object-fit-cover main-photo'>
                                
                                    <div class='d-flex flex-column gap-3 align-items-start'>
                                        <h1>${datos_publicacion[0].titulo}</h1>
                                        <pre class='full-post-content'>${datos_publicacion[0].contenido}</pre>
                                        <i>Publicado el ${formatDate(datos_publicacion[0].fecha)}</i>
                                        <button type="button" style='--clr:#0ce8e8' class='btn-danger-own'><span>Volver al grupo</span><i></i></button>
                                    </div></div>`
    if(fotos_extra != undefined){
        const div_fotos_extra = document.createElement("div")
        div_fotos_extra.classList.add("d-flex", "flex-column", "flex-md-row", "gap-3")
        
        fotos_extra.forEach(foto=>{
            const img = document.createElement("img")
            img.classList.add("rounded", "extra-photo-post", "object-fit-cover")
            img.src=`${foto.enlace}`
            div_fotos_extra.appendChild(img)
        })
        publicacion_container.appendChild(div_fotos_extra)
    }
    const btn = publicacion_container.querySelector("button")
    btn.addEventListener("click", ()=>{
        showGroup(datos_publicacion[0].grupo)
    })
    const canvas = publicacion_container.querySelector("canvas")
    const img = publicacion_container.querySelector(".main-photo")
    canvas.width='300'
    canvas.height='300'
    let ctxt = canvas.getContext("2d")
    ctxt.drawImage(img, 0, 0, 280, 280)
    canvas.style.display="none"
    const image_data = ctxt.getImageData(0,0,canvas.width, canvas.height)
    let rgb_array = buildRGBArray(image_data.data)
    const quantColors = quantization(rgb_array, 0)
    quantColors.sort((a,b) => a-b)
    let color1 = quantColors[quantColors.length-1]
    let color2 = quantColors[quantColors.length-8]
    let color3 = quantColors[quantColors.length-4]
    let color4 = quantColors[quantColors.length-11]
    let color5 = quantColors[quantColors.length-13]

    publicacion_container.style.background=`linear-gradient(250deg, rgba(${color1.r},${color1.g},${color1.b},.5) 40%, rgba(${color3.r},${color3.g},${color3.b},0.6500175070028011) 50% , rgba(${color2.r}, ${color2.g}, ${color2.b}, .85), rgba(${color5.r},${color5.g},${color5.b},1) 100%)`
    main_content.appendChild(publicacion_container)
}


async function playSong(index){
    audio.src=cola_reproduccion[index].archivo
    track_info.innerHTML=`<img src='${cola_reproduccion[index].caratula}' class='rounded'>
                            <div class='d-flex flex-column'>
                                <span class='track-info-title'>${cola_reproduccion[index].titulo}</span>
                                <span class='track-info-artist'>${cola_reproduccion[index].autor}</span>
                            </div>`
    console.log(cola_reproduccion[index])
    bar2.style.width='0%'
    dot.style.left='0'
    current_time.innerText='0:00'
    audio.play()
    play_pause.setAttribute("name", "pause-outline")
    player_logo.classList.add("active")
    console.log("ee")
    console.log(cola_reproduccion[index])
    await fetch(`../api_audio/update_times_played.php?id=${cola_reproduccion[index].cancion_id}`)
}


//Funcion para crear un array de valores RGB manejable a partir de los datos del elemento canvas
function buildRGBArray(imageData){
const rgbValues = []
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    }
    rgbValues.push(rgb)
  }
  return rgbValues
}

//Funcion que, partiendo del array de valores RGB, nos devuelve qué componente (R red, G green o B blue) es el más representativo de la imagen
function findBiggestColorRange(rgb_array){
    let rMin = Number.MAX_VALUE
    let gMin = Number.MAX_VALUE
    let bMin = Number.MAX_VALUE
  
    let rMax = Number.MIN_VALUE
    let gMax = Number.MIN_VALUE
    let bMax = Number.MIN_VALUE
  
    rgb_array.forEach((pixel) => {
      rMin = Math.min(rMin, pixel.r)
      gMin = Math.min(gMin, pixel.g)
      bMin = Math.min(bMin, pixel.b)
  
      rMax = Math.max(rMax, pixel.r)
      gMax = Math.max(gMax, pixel.g)
      bMax = Math.max(bMax, pixel.b)
    })
  
    const rRange = rMax - rMin
    const gRange = gMax - gMin
    const bRange = bMax - bMin
  
    const biggestRange = Math.max(rRange, gRange, bRange)
    if (biggestRange === rRange) {
      return "r"
    } else if (biggestRange === gRange) {
      return "g"
    } else {
      return "b"
    }
  };

  //Última función del proceso de extracción de colores de la imagen, la cual nos devolverá un array de objetos con los valores RGB más presentes en dicha imagen
  function quantization(rgbValues, depth){
    const MAX_DEPTH = 4
  
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev, curr) => {
          prev.r += curr.r;
          prev.g += curr.g;
          prev.b += curr.b;
  
          return prev;
        },
        {
          r: 0,
          g: 0,
          b: 0,
        }
      )
  
      color.r = Math.round(color.r / rgbValues.length)
      color.g = Math.round(color.g / rgbValues.length)
      color.b = Math.round(color.b / rgbValues.length)
  
      return [color]
    }
  
    /**
     *  Mediante recursividad seguimos el siguiente procediminento:
     *  1. Encontrar el valor (R,G o B) con la mayor diferencia
     *  2. Realizamos una ordenación a partir de este canal
     *  3. Dividimos la lista de colores RGB por la mitad
     *  4. Repetimos el proceso hasta alcanzar la profundidad deseada
     */
    const componentToSortBy = findBiggestColorRange(rgbValues)
    rgbValues.sort((p1, p2) => {
      return p1[componentToSortBy] - p2[componentToSortBy]
    })
  
    const mid = rgbValues.length / 2;
    return [
      ...quantization(rgbValues.slice(0, mid), depth + 1),
      ...quantization(rgbValues.slice(mid + 1), depth + 1),
    ]
  }

  //Función que recibe una fecha y la devuelve en formato español
  function formatDate(fecha){
    let date_object = new Date(fecha)
    return `${addZeroToDate(date_object.getDate())}-${addZeroToDate(date_object.getMonth()+1)}-${date_object.getFullYear()}`
  }

  //Función que añade ceros a la izquierda a una fecha si fuera necesario (ej. 2 => 02)
  function addZeroToDate(fecha){
    return fecha < 10 ? `0${fecha}` : fecha
  }
