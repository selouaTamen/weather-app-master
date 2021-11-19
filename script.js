const weatherCard = {
    props: {
        icon: String,
        dateTime: String,
        temp: Number,
        description: String,
        speed: Number,


    },

    template:
        `
    <div class=weatherCard>
    <img :src="'http://openweathermap.org/img/wn/' + icon + '@2x.png'" />
    <p>{{dateTime}}</p>
    <p>{{temp}}°C</p>
    <p>{{description}}</p>
    <p>{{speed}} km/h</p>
    </div>
    `
    ,
};

const RootComponent = {
    components: {
        weatherCard: weatherCard,
    },

    data() {
        return {
            meteoArray: [],
            forecastLocation: "",
            choixVille: "",
        }
    },


    async mounted() {
        const response = await fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=Nice&appid=c23ea174dddff27c2a35fc309bafcc38&units=metric&lang=fr",
        );
        const data = await response.json();
        this.meteoArray = data.list;
        this.forecastLocation = data.city.name;
        console.log(this.meteoArray);
    },
    methods: {
        getForecastByLocation() {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=7524b547972909bbc321d4e184e23f48&units=metric&lang=fr`;

                const response = await fetch(url);

                const data = await response.json();

                this.meteoArray = data.list;
                this.forecastLocation = data.city.name;
            });
        },
        async getForecastByLocationInput() {
            let choix = this.choixVille;
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${choix}&appid=c23ea174dddff27c2a35fc309bafcc38&units=metric&lang=fr`;

            const response = await fetch(url);

            const data = await response.json();

            this.meteoArray = data.list;
            this.forecastLocation = data.city.name;
        }

    },


    template:
        `
        <h1>{{forecastLocation}}</h1>
        <div id="choix">
        <label for="choix">Selectionne la ville de ton choix:</label>
        <input id="choix" v-model="choixVille" type="text" @keydown.enter="getForecastByLocationInput" placeholder="Choix Ville"/>
        </div>
        </br>
        <div class="geoloc"><button class="localisation" @click="getForecastByLocation">Météo par géolocalisation</button></div>
        
        <div class=weatherCard-container>
        <weatherCard 
            v-for="forecast in meteoArray"
            :icon="forecast.weather[0].icon"
            :dateTime="forecast.dt_txt"
            :temp="forecast.main.temp"
            :description="forecast.weather[0].description"
            :speed="forecast.wind.speed"
        ></weatherCard>
        </div>
        
        </br>
        
        
        `
    ,


};

Vue.createApp(RootComponent).mount("#root");