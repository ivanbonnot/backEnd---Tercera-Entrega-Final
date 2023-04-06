class Random {
    getNumbers = (amount) => {

        const numerosAleatorios = {};

        for (let i = 0; i < amount; i++) {
            const numeroAleatorio = Math.floor(Math.random() * 1000) + 1;
            numerosAleatorios[`${i + 1}`] = numeroAleatorio;
        }

        return numerosAleatorios;
    }
}

const randomController = new Random()

module.exports = randomController