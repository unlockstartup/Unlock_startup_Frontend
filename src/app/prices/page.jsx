'use client';

import { useState, useEffect } from 'react';
import './pricing.css';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import api from '@/app/api';


function planLabels(months) {
  if (months === 3)  return { name: 'Startup Basic',  desc: 'For solo founders validating an idea. Get a project live without any overhead.' };
  if (months === 6)  return { name: 'Startup Plus',   desc: 'The complete toolkit for early-stage teams. Build faster, present confidently, iterate without limits.' };
  if (months === 9)  return { name: 'Startup Pro',    desc: 'Advanced tooling and dedicated support for teams moving fast and managing multiple products.' };
  return                    { name: 'Startup Elite',  desc: 'Best value for long-term power users who need everything, always.' };
}

function buildFeatures(plan) {
  const items = [];

  if (plan.jobLimit !== undefined) {
    items.push(
      plan.jobLimit === 0
        ? 'Unlimited job postings'
        : `Up to ${plan.jobLimit} job posting${plan.jobLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.eventLimit !== undefined) {
    items.push(
      plan.eventLimit === 0
        ? 'Unlimited events'
        : `Up to ${plan.eventLimit} event${plan.eventLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.productsLimit !== undefined) {
    items.push(
      plan.productsLimit === 0
        ? 'Unlimited products'
        : `Up to ${plan.productsLimit} product${plan.productsLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.fundingCallsLimit !== undefined) {
    items.push(
      plan.fundingCallsLimit === 0
        ? 'Unlimited funding calls'
        : `Up to ${plan.fundingCallsLimit} funding call${plan.fundingCallsLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.serviceListingLimit !== undefined) {
    items.push(
      plan.serviceListingLimit === 0
        ? 'Unlimited service listings'
        : `Up to ${plan.serviceListingLimit} service listing${plan.serviceListingLimit !== 1 ? 's' : ''}`
    );
  }
  if (Array.isArray(plan.features)) {
    plan.features.forEach((f) => items.push(f));
  }

  return items;
}

function adaptPlan(plan) {
  const { name, desc } = planLabels(plan.durationInMonths);
  return {
    _id:              plan._id,
    name,
    desc,
    price:            plan.price,
    durationInMonths: plan.durationInMonths,
    features:         buildFeatures(plan),
  };
}

const FREE_PLAN = {
  _id: 'free-plan-static',
  name: 'Startup Free',
  desc: 'Kick the tyres at zero cost. Get a feel for the platform before committing to a paid plan.',
  price: 0,
  durationInMonths: 1,
  features: [
    'Up to 1 job posting',
    'Up to 1 event',
    'Up to 1 product',
    'Up to 1 funding call',
    'Community support',
  ],
};

const SERVICE_TIERS = [
  { durationType: '6m',  label: '6-Month Plan', priceKey: 'sixMonthPrice', period: '/ 6 months', desc: 'Flexible half-year access to service listings.' },
  { durationType: '12m', label: 'Yearly Plan',  priceKey: 'yearlyPrice',   period: '/ year',     desc: 'Best value — full year of service listings.' },
];

function buildServiceFeatures(plan) {
  if (plan.serviceListingLimit === undefined) return [];
  return [
    plan.serviceListingLimit === 0
      ? 'Unlimited service listings'
      : `Up to ${plan.serviceListingLimit} service listing${plan.serviceListingLimit !== 1 ? 's' : ''}`,
  ];
}



const CheckIcon = () => (
  <svg className="pricingPage__featureIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 13l4 4L19 7" />
  </svg>
);



export default function Page() {
  const [plans, setPlans]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const [servicePlans, setServicePlans]     = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError]     = useState(null);

  useEffect(() => {
    // Fetch subscription plans
    (async () => {
      try {
        const res = await api.get('/api/subscription/plans');
        if (res.data?.success) {
          setPlans((res.data.plans || []).map(adaptPlan));
        } else {
          setError('Failed to load plans.');
        }
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
        setError('Could not load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();

    // Fetch service plans
    (async () => {
      try {
        const res = await api.get('/api/service-plans');
        if (res.data?.success) {
          setServicePlans(res.data.plans || []);
        } else {
          setServiceError('Failed to load service plans.');
        }
      } catch (err) {
        console.error('Failed to fetch service plans:', err);
        setServiceError('Could not load service plans. Please try again later.');
      } finally {
        setServiceLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <main className="pricingPage__main">

        {/* Hero Section */}
        <section className="pricingPage__hero">
          <div className="pricingPage__container">
            <h1>Transparent pricing, built for every stage</h1>
            <p>
              From your first idea to full-scale operations — choose a plan that fits where you are today
              and grows with you. No hidden fees, no long-term commitments.
            </p>
          </div>
        </section>

        {/* Subscription Plans Grid */}
        <section className="pricingPage__pricing" id="pricing">
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Subscription Plans
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '15px', marginBottom: '40px' }}>
            Publish and manage your job listings, event listings and fundings. Pick a duration that suits your needs.
          </p>
          <div className="pricingPage__container">

            {loading && (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                Loading plans…
              </p>
            )}
            {error && (
              <p style={{ textAlign: 'center', color: '#ef4444', padding: '40px 0' }}>
                {error}
              </p>
            )}

{!loading && !error && (
  <div className="pricingPage__pricingGrid">
    {[FREE_PLAN, ...plans].map((plan) => (
      <div key={plan._id} className="pricingPage__planCard">
        <h2 className="pricingPage__planName">{plan.name}</h2>
        <div className="pricingPage__planPrice">
          <span className="pricingPage__priceAmount">
            {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
          </span>
          <span className="pricingPage__pricePeriod">/ {plan.durationInMonths} month{plan.durationInMonths !== 1 ? 's' : ''}</span>
        </div>
        <p className="pricingPage__planDesc">{plan.desc}</p>
        <ul className="pricingPage__featuresList">
          {plan.features.map((f) => (
            <li key={f} className="pricingPage__featureItem">
              <CheckIcon />
              {f}
            </li>
          ))}
        </ul>
        <a href="#signup" className="pricingPage__btn pricingPage__btnSecondary pricingPage__planCta">
          {plan.price === 0 ? 'Start Free' : 'Get Started'}
        </a>
      </div>
    ))}
  </div>
)}

          </div>
        </section>

        {/* Service Plans Grid */}
        <section className="pricingPage__pricing" id="service-plans">
          <div className="pricingPage__container">

            <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Service Plans
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '15px', marginBottom: '40px' }}>
              Publish and manage your service listings. Pick a duration that suits your needs.
            </p>

            {serviceLoading && (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                Loading service plans…
              </p>
            )}
            {serviceError && (
              <p style={{ textAlign: 'center', color: '#ef4444', padding: '40px 0' }}>
                {serviceError}
              </p>
            )}

            {!serviceLoading && !serviceError && (
              <div className="pricingPage__pricingGrid">
                {servicePlans.flatMap((plan) =>
                  SERVICE_TIERS.map(({ durationType, label, priceKey, period, desc }) => {
                    const price    = plan[priceKey];
                    const features = buildServiceFeatures(plan);
                    const cardKey  = `${plan._id}_${durationType}`;

                    return (
                      <div key={cardKey} className="pricingPage__planCard">
                        <h2 className="pricingPage__planName">{label}</h2>
                        <div className="pricingPage__planPrice">
                          <span className="pricingPage__priceAmount">
                            ₹{(price ?? 0).toLocaleString('en-IN')}
                          </span>
                          <span className="pricingPage__pricePeriod">{period}</span>
                        </div>
                        <p className="pricingPage__planDesc">{desc}</p>
                        <ul className="pricingPage__featuresList">
                          {features.map((f) => (
                            <li key={f} className="pricingPage__featureItem">
                              <CheckIcon />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <a href="#signup" className="pricingPage__btn pricingPage__btnSecondary pricingPage__planCta">
                          Get Started
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            )}

          </div>
        </section>

        {/* FAQ Section */}
        <section className="pricingPage__faq" id="faq">
          <div className="pricingPage__container">
            <h2>Frequently Asked Questions</h2>
            <div className="pricingPage__faqGrid">
              <details className="pricingPage__faqItem">
                <summary>How does the 14-day trial work?</summary>
                <p>Start any paid plan with full access for 14 days completely free. No credit card required upfront. Cancel anytime.</p>
              </details>
              <details className="pricingPage__faqItem">
                <summary>Can I upgrade or downgrade plans?</summary>
                <p>Yes! Upgrade instantly, downgrade at billing cycle end. We prorate everything fairly so you only pay for what you use.</p>
              </details>
              <details className="pricingPage__faqItem">
                <summary>What payment methods do you accept?</summary>
                <p>Razorpay, cards, UPI, net banking.</p>
              </details>
              <details className="pricingPage__faqItem">
                <summary>Is there a money-back guarantee?</summary>
                <p>100% satisfaction or your money back within 30 days. We are confident you will love building with us!</p>
              </details>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}