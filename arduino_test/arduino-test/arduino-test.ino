// Device de teste para o curso Interfaces Modernas - Grupo All Electronics e VolcanLab's
// Adquira o curso completo em https://bit.ly/34tesYJ
// Gera um sinal harmônico na porta serial para teste da interface do curso

const float F  = 0.2f; 	  // frequência da senoide
const float Fs = 50.f;    // taxa de amostragem

const float Ts = 1.f / Fs;  // período de amostragem

// define a amplitude de cada harmonico 
const uint8_t N_harmonics  = 5;
const float A[N_harmonics] = {1.f, 0.23f, 0.34f, 0.32f, 0.17f};

// amplitude do ruído
const float An             = 0.3f;

const uint32_t int_Ts = Ts * 1e6f;
uint32_t last_sample  = 0;
float t               = 0;

float gaussian_noise(const uint8_t samples);

void setup()
{
	Serial.begin(57600);
}

void loop()
{
	// controle do tempo de amostragem ---------------------------
	if (micros() - last_sample < int_Ts)
		return;
	
	last_sample = micros();

	// gera o sinal contendo a importância de cada harmonico -----
	float output = 0;
	for (uint8_t i = 0; i < N_harmonics; i++)
		output += A[i] * sin(2.f * M_PI * F * (i + 1) * t);

	output += An * gaussian_noise(8);

	// incrementa o tempo ----------------------------------------
	t += Ts;

	Serial.println(output);
}

// retorna uma amostra do ruído gaussiano utilizando
// o teorema do limite central 
float gaussian_noise(const uint8_t samples)
{
	const float MAX = 1000;
	float sum       = 0;

	for (uint8_t i = 0; i < samples; i++)
		sum += (-MAX / 2.f + random(MAX)) / MAX;

	return sum / samples;	
}