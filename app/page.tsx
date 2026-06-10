'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwZHW5odkvE0n6Dm_edC9ksWiz5Pc6VPvn48hA95kpOoYtdhJEG29Yc0bL4jh7Xpt4wiA/exec';

type Answers = {
  solar: string;
  solarKwp: number;
  yearlyUsage: number;
  situation: string;
  dynamicContract: string;
};

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  message: string;
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');

  const [answers, setAnswers] = useState<Answers>({
    solar: '',
    solarKwp: 6,
    yearlyUsage: 3500,
    situation: '',
    dynamicContract: '',
  });

  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    message: '',
  });

  const totalSteps = 6;
  const progress = Math.min((step / totalSteps) * 100, 100);

  const estimatedSolarProduction = Math.round(answers.solarKwp * 900);
  const estimatedDailyUsage = Math.round(answers.yearlyUsage / 365);

  const recommendedBattery =
    answers.situation === 'Agrarisch' || answers.situation === 'Bedrijf'
      ? 'Maatwerk energieopslag'
      : answers.solar === 'Nee'
      ? 'Oriëntatieadvies'
      : answers.solarKwp <= 4 && answers.yearlyUsage < 3500
      ? '5 kWh thuisaccu'
      : answers.solarKwp <= 7 && answers.yearlyUsage < 6000
      ? '10 kWh thuisaccu'
      : answers.solarKwp <= 10 && answers.yearlyUsage < 8500
      ? '15 kWh thuisaccu'
      : '20 kWh+ thuisaccu';

  const savingText =
    answers.situation === 'Bedrijf' || answers.situation === 'Agrarisch'
      ? 'Zakelijke analyse aanbevolen'
      : answers.dynamicContract === 'Ja'
      ? 'Hoog besparingspotentieel bij slimme sturing'
      : 'Sterk potentieel voor meer eigen verbruik';

  function updateAnswer<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function updateLead<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setLeadForm((prev) => ({ ...prev, [key]: value }));
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  }

  function previousStep() {
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function submitLead() {
    setSubmitError('');

    if (!leadForm.name || !leadForm.email || !leadForm.phone) {
      setSubmitError('Vul minimaal uw naam, e-mailadres en telefoonnummer in.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('name', leadForm.name);
      formData.append('email', leadForm.email);
      formData.append('phone', leadForm.phone);
      formData.append('postcode', leadForm.postcode);
      formData.append('message', leadForm.message);

      formData.append('solar', answers.solar);
      formData.append('solarKwp', String(answers.solarKwp));
      formData.append('yearlyUsage', String(answers.yearlyUsage));
      formData.append('situation', answers.situation);
      formData.append('dynamicContract', answers.dynamicContract);
      formData.append('recommendedBattery', recommendedBattery);
      formData.append('savingText', savingText);
      formData.append('selectedSystem', selectedSystem);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setStep(8);
    } catch {
      setStep(8);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F1115] text-white">
      {step === 0 && (
        <section className="min-h-screen flex items-center px-6 py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <img
  src="/vdp-logo-goud.png"
  alt="VDP Dakbedekking"
  className="mb-8 h-28 w-auto"
/>
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#C8A96B]">
                Energieopslagscan
              </p>

              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
                Ontdek welke <span className="text-[#C8A96B]">thuisaccu</span>{' '}
                bij uw situatie past
              </h1>

              <p className="mb-10 max-w-xl text-lg leading-8 text-gray-300">
                Bereken in enkele stappen welke energieopslag het beste past bij
                uw woning, zonnepanelen en energieverbruik.
              </p>

              <button
                onClick={nextStep}
                className="rounded-xl bg-[#C8A96B] px-8 py-4 font-bold text-black transition hover:bg-[#D8BB84]"
              >
                Start de scan →
              </button>
            </div>

 <div className="relative overflow-hidden rounded-[2rem] border border-[#C8A96B]/20 bg-[#171A21] shadow-2xl">
  <img
    src="/energie opslag header.png"
    alt="Energieopslag"
    className="h-[600px] w-full object-cover"
  />
</div>
</div>
  </section>
)}

      {step > 0 && step < totalSteps && (
        <section className="min-h-screen flex items-center px-6 py-20">
          <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-white/10 bg-[#171A21] p-8 md:p-12">
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.2em] text-[#C8A96B]">
                  Stap {step} van {totalSteps - 1}
                </p>
                <p className="text-sm text-gray-400">{Math.round(progress)}%</p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-[#C8A96B] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {step === 1 && (
              <QuestionWrapper
                title="Heeft u zonnepanelen?"
                description="Hiermee bepalen we of energieopslag direct rendement kan opleveren."
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {['Ja', 'Nee'].map((option) => (
                    <OptionButton
                      key={option}
                      title={option}
                      description={
                        option === 'Ja'
                          ? 'Ik heb zonnepanelen of laat deze binnenkort plaatsen.'
                          : 'Ik wil mij oriënteren op energieopslag.'
                      }
                      onClick={() => {
                        updateAnswer('solar', option);
                        if (option === 'Nee') {
                          updateAnswer('solarKwp', 0);
                          setStep(3);
                        } else {
                          nextStep();
                        }
                      }}
                    />
                  ))}
                </div>
              </QuestionWrapper>
            )}

            {step === 2 && (
              <QuestionWrapper
                title="Hoeveel kWp aan zonnepanelen heeft u?"
                description="Dit bepaalt hoeveel zonne-energie er gemiddeld beschikbaar is om op te slaan."
              >
                <SliderCard
                  value={`${answers.solarKwp.toFixed(1)} kWp`}
                  subtitle={`Geschatte jaaropbrengst: ${estimatedSolarProduction.toLocaleString(
                    'nl-NL'
                  )} kWh`}
                  min={1}
                  max={30}
                  step={0.5}
                  currentValue={answers.solarKwp}
                  onChange={(value) => updateAnswer('solarKwp', value)}
                />

                <NavigationButtons onBack={previousStep} onNext={nextStep} />
              </QuestionWrapper>
            )}

            {step === 3 && (
              <QuestionWrapper
                title="Wat is uw jaarlijks stroomverbruik?"
                description="Gebruik hiervoor bij voorkeur uw jaarafrekening of een realistische schatting."
              >
                <SliderCard
                  value={`${answers.yearlyUsage.toLocaleString('nl-NL')} kWh`}
                  subtitle={`Gemiddeld per dag: ${estimatedDailyUsage.toLocaleString(
                    'nl-NL'
                  )} kWh`}
                  min={1000}
                  max={30000}
                  step={250}
                  currentValue={answers.yearlyUsage}
                  onChange={(value) => updateAnswer('yearlyUsage', value)}
                />

                <NavigationButtons onBack={previousStep} onNext={nextStep} />
              </QuestionWrapper>
            )}

            {step === 4 && (
              <QuestionWrapper
                title="Wat past het beste bij uw situatie?"
                description="Zo kunnen we onderscheid maken tussen particulier, zakelijk en grotere energiebehoeftes."
              >
                <div className="grid gap-6 md:grid-cols-3">
                  {['Woning', 'Bedrijf', 'Agrarisch'].map((option) => (
                    <OptionButton
                      key={option}
                      title={option}
                      description={
                        option === 'Woning'
                          ? 'Particuliere woning of groot gezin.'
                          : option === 'Bedrijf'
                          ? 'Zakelijke opslag of bedrijfspand.'
                          : 'Boerderij, loods of grote installatie.'
                      }
                      onClick={() => {
                        updateAnswer('situation', option);
                        nextStep();
                      }}
                    />
                  ))}
                </div>
              </QuestionWrapper>
            )}

            {step === 5 && (
              <QuestionWrapper
                title="Heeft u een dynamisch energiecontract?"
                description="Slim laden en ontladen kan extra interessant zijn bij dynamische tarieven."
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {['Ja', 'Nee'].map((option) => (
                    <OptionButton
                      key={option}
                      title={option}
                      description={
                        option === 'Ja'
                          ? 'Ik wil inspelen op goedkope en dure stroommomenten.'
                          : 'Ik wil vooral meer eigen zonne-energie gebruiken.'
                      }
                      onClick={() => {
                        updateAnswer('dynamicContract', option);
                        nextStep();
                      }}
                    />
                  ))}
                </div>
              </QuestionWrapper>
            )}
          </div>
        </section>
      )}

      {step === totalSteps && (
        <section className="min-h-screen flex items-center px-6 py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#C8A96B]/20 bg-[#171A21] p-8 md:p-10">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#C8A96B]">
                Uw persoonlijke indicatie
              </p>

              <h2 className="mb-6 text-5xl font-bold">{recommendedBattery}</h2>

              <p className="mb-8 text-lg leading-8 text-gray-300">
                Op basis van uw ingevulde gegevens lijkt deze oplossing het best
                aan te sluiten. Dit is een indicatief advies. Voor een exacte
                berekening controleren wij uw verbruik, teruglevering,
                zonnepanelen en aansluiting.
              </p>

              <div className="mb-8 rounded-2xl border border-[#C8A96B]/20 bg-black/30 p-6">
                <p className="mb-2 text-sm uppercase tracking-widest text-[#C8A96B]">
                  Besparingspotentieel
                </p>
                <p className="text-2xl font-bold">{savingText}</p>
              </div>

              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <ResultCard title="Zonnepanelen" value={answers.solar} />
                <ResultCard
                  title="PV vermogen"
                  value={
                    answers.solar === 'Ja'
                      ? `${answers.solarKwp.toFixed(1)} kWp`
                      : 'Niet aanwezig'
                  }
                />
                <ResultCard
                  title="Jaaropbrengst indicatie"
                  value={
                    answers.solar === 'Ja'
                      ? `${estimatedSolarProduction.toLocaleString(
                          'nl-NL'
                        )} kWh`
                      : 'Niet van toepassing'
                  }
                />
                <ResultCard
                  title="Jaarverbruik"
                  value={`${answers.yearlyUsage.toLocaleString('nl-NL')} kWh`}
                />
                <ResultCard title="Situatie" value={answers.situation} />
                <ResultCard
                  title="Dynamisch contract"
                  value={answers.dynamicContract}
                />
              </div>

              <div className="mb-8">
  <h3 className="mb-6 text-3xl font-bold">
    Vergelijk passende systemen
  </h3>

  <div className="grid gap-6">
    <SystemCard
      brand="SolarEdge"
      title="SolarEdge Home Battery"
      image="/Solaredge thuisbattery.png"
      price="Indicatie vanaf €6.500 – €9.500"
      description="Premium thuisaccu met uitgebreide monitoring en sterke integratie met SolarEdge omvormers."
      selected={selectedSystem === 'SolarEdge Home Battery'}
      onClick={() => setSelectedSystem('SolarEdge Home Battery')}
    />

    <SystemCard
      brand="Huawei"
      title="Huawei LUNA2000"
      image="/Huawei luna 2000 thuisbattery.png"
      price="Indicatie vanaf €5.500 – €8.500"
      description="Modulair batterijsysteem met moderne uitstraling en goede integratie binnen Huawei installaties."
      selected={selectedSystem === 'Huawei LUNA2000'}
      onClick={() => setSelectedSystem('Huawei LUNA2000')}
    />

    <SystemCard
      brand="Sigenergy"
      title="Sigenergy SigenStor"
      image="/Sigenergy thuisbattery.png"
      price="Indicatie vanaf €7.000 – €12.000"
      description="Modern all-in-one energiesysteem met slimme sturing, uitbreidbaarheid en premium uitstraling."
      selected={selectedSystem === 'Sigenergy SigenStor'}
      onClick={() => setSelectedSystem('Sigenergy SigenStor')}
    />
  </div>
</div>

              <button
                onClick={() => setStep(7)}
                className="w-full rounded-xl bg-[#C8A96B] px-8 py-4 font-bold text-black transition hover:bg-[#D8BB84]"
              >
                Ontvang vrijblijvend persoonlijk advies →
              </button>

              <button
                onClick={() => setStep(0)}
                className="mt-4 w-full rounded-xl border border-white/10 px-8 py-4 font-bold text-white transition hover:border-[#C8A96B]"
              >
                Scan opnieuw starten
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#C8A96B]/20 bg-[#171A21] shadow-2xl">
  <img
    src="/advies header.png"
    alt="Energieopslag"
    className="h-full min-h-[900px] w-full object-cover"
  />
</div>
          </div>
        </section>
      )}

      {step === 7 && (
        <section className="min-h-screen flex items-center px-6 py-20">
          <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-[#C8A96B]/20 bg-[#171A21] p-8 md:p-12">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#C8A96B]">
              Persoonlijk advies
            </p>

            <h2 className="mb-6 text-4xl font-bold">
              Ontvang uw advies op maat
            </h2>

            <p className="mb-8 text-lg leading-8 text-gray-300">
              Laat uw gegevens achter en wij nemen contact met u op voor een
              exacte berekening, passend systeem en vrijblijvende offerte.
            </p>

            <div className="grid gap-5">
              <input
                type="text"
                placeholder="Naam"
                value={leadForm.name}
                onChange={(e) => updateLead('name', e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-[#C8A96B]"
              />

              <input
                type="email"
                placeholder="E-mailadres"
                value={leadForm.email}
                onChange={(e) => updateLead('email', e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-[#C8A96B]"
              />

              <input
                type="tel"
                placeholder="Telefoonnummer"
                value={leadForm.phone}
                onChange={(e) => updateLead('phone', e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-[#C8A96B]"
              />

              <input
                type="text"
                placeholder="Postcode"
                value={leadForm.postcode}
                onChange={(e) => updateLead('postcode', e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-[#C8A96B]"
              />

              <textarea
                placeholder="Eventuele opmerking"
                rows={4}
                value={leadForm.message}
                onChange={(e) => updateLead('message', e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-[#C8A96B]"
              />

              {submitError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {submitError}
                </p>
              )}

              <button
                onClick={submitLead}
                disabled={isSubmitting}
                className="mt-4 rounded-xl bg-[#C8A96B] px-8 py-4 font-bold text-black transition hover:bg-[#D8BB84] disabled:opacity-60"
              >
                {isSubmitting ? 'Versturen...' : 'Verstuur aanvraag →'}
              </button>

              <button
                onClick={() => setStep(6)}
                className="rounded-xl border border-white/10 px-8 py-4 font-bold text-white transition hover:border-[#C8A96B]"
              >
                ← Terug naar resultaat
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 8 && (
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#C8A96B]/20 bg-[#171A21] p-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#C8A96B]">
              Aanvraag ontvangen
            </p>

            <h2 className="mb-6 text-5xl font-bold">
              Bedankt voor uw aanvraag
            </h2>

            <p className="mb-8 text-lg leading-8 text-gray-300">
              Uw gegevens en energieopslagadvies zijn ontvangen. Wij nemen
              spoedig contact met u op voor een persoonlijk advies op maat.
            </p>

            <button
              onClick={() => setStep(0)}
              className="rounded-xl bg-[#C8A96B] px-8 py-4 font-bold text-black transition hover:bg-[#D8BB84]"
            >
              Nieuwe scan starten →
            </button>
            <a
              href="https://www.vdpdakbedekking.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-xl border border-white/10 px-8 py-4 text-center font-bold text-white transition hover:border-[#C8A96B]"
            >
              Terug naar VDP Dakbedekking →
            </a>
          </div>
        </section>
      )}
    </main>
  );
}

function QuestionWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <h2 className="mb-6 text-4xl font-bold">{title}</h2>
      <p className="mb-10 text-lg text-gray-300">{description}</p>
      {children}
    </>
  );
}

function OptionButton({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-white/10 bg-white/5 p-8 text-left transition hover:border-[#C8A96B] hover:bg-white/10"
    >
      <p className="mb-3 text-2xl font-bold">{title}</p>
      <p className="text-gray-400">{description}</p>
    </button>
  );
}

function SliderCard({
  value,
  subtitle,
  min,
  max,
  step,
  currentValue,
  onChange,
}: {
  value: string;
  subtitle: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#C8A96B]/20 bg-black/30 p-8">
      <p className="mb-2 text-5xl font-bold text-[#C8A96B]">{value}</p>
      <p className="mb-8 text-gray-400">{subtitle}</p>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function NavigationButtons({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-10 flex justify-between">
      <button onClick={onBack} className="text-gray-400 hover:text-white">
        ← Terug
      </button>

      <button
        onClick={onNext}
        className="rounded-xl bg-[#C8A96B] px-8 py-4 font-bold text-black transition hover:bg-[#D8BB84]"
      >
        Volgende →
      </button>
    </div>
  );
}

function ResultCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="mb-2 text-sm text-gray-400">{title}</p>
      <p className="text-xl font-bold">{value || 'Niet ingevuld'}</p>
    </div>
  );
}

function SystemCard({
  brand,
  title,
  image,
  price,
  description,
  selected,
  onClick,
}: {
  brand: string;
  title: string;
  image: string;
  price: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`overflow-hidden rounded-2xl border text-left transition ${
        selected
          ? 'border-[#C8A96B] bg-[#C8A96B]/10 shadow-2xl'
          : 'border-[#C8A96B]/20 bg-white/5 hover:border-[#C8A96B] hover:bg-white/10'
      }`}
    >
      <img
        src={image}
        alt={title}
        className="h-56 w-full object-cover"
      />

      <div className="p-6">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#C8A96B]">
          {brand}
        </p>

        <h4 className="mb-3 text-2xl font-bold">{title}</h4>

        <p className="mb-4 text-xl font-bold text-[#C8A96B]">{price}</p>

        <p className="text-sm leading-6 text-gray-300">{description}</p>

        {selected && (
          <p className="mt-5 rounded-xl bg-[#C8A96B] px-4 py-3 text-center text-sm font-bold text-black">
            Geselecteerd
          </p>
        )}
      </div>
    </button>
  );
}
