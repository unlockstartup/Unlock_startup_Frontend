'use client';

import { useState, useEffect } from 'react';
import './pricing.css';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import api from '@/app/api';


function planLabels(months) {
  if (months === 0)  return { name: 'Startup Free',  desc: 'Kick the tyres at zero cost. Get a feel for the platform before committing to a paid plan.' };
  if (months === 3)  return { name: 'Startup Basic', desc: 'For solo founders validating an idea. Get a project live without any overhead.' };
  if (months === 6)  return { name: 'Startup Plus',  desc: 'The complete toolkit for early-stage teams. Build faster, present confidently, iterate without limits.' };
  if (months === 9)  return { name: 'Startup Pro',   desc: 'Advanced tooling and dedicated support for teams moving fast and managing multiple products.' };
  return                    { name: 'Startup Elite', desc: 'Best value for long-term power users who need everything, always.' };
}

function buildFeatures(plan) {
  const items = [];

  if (plan.jobLimit !== undefined) {
    items.push(
      plan.jobLimit === 0
        ? 'Unlimited job postings'
        : `${plan.jobLimit} job posting${plan.jobLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.eventLimit !== undefined) {
    items.push(
      plan.eventLimit === 0
        ? 'Unlimited events'
        : `${plan.eventLimit} event${plan.eventLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.productsLimit !== undefined) {
    items.push(
      plan.productsLimit === 0
        ? 'Unlimited products'
        : `${plan.productsLimit} product${plan.productsLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.fundingCallsLimit !== undefined) {
    items.push(
      plan.fundingCallsLimit === 0
        ? 'Unlimited funding calls'
        : `${plan.fundingCallsLimit} funding call${plan.fundingCallsLimit !== 1 ? 's' : ''}`
    );
  }
  if (plan.serviceListingLimit !== undefined) {
    items.push(
      plan.serviceListingLimit === 0
        ? 'Unlimited service listings'
        : `${plan.serviceListingLimit} service listing${plan.serviceListingLimit !== 1 ? 's' : ''}`
    );
  }
  if (Array.isArray(plan.features)) {
    plan.features.forEach((f) => { if (f?.trim()) items.push(f); });
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

const SERVICE_TIERS = [
  { durationType: '6m',  label: '6-Month Plan', priceKey: 'sixMonthPrice', period: '/ 6 months', desc: 'Showcase your expertise and connect with new customers through a flexible six-month service listing plan.' },
  { durationType: '12m', label: 'Yearly Plan',  priceKey: 'yearlyPrice',   period: '/ year',     desc: 'Expand your reach with 1 year of continuous service marketplace exposure.' },
];

function buildServiceFeatures(plan) {
  if (plan.serviceListingLimit === undefined) return [];
  return [
    plan.serviceListingLimit === 0
      ? 'Unlimited service listings'
      : `${plan.serviceListingLimit} service listing${plan.serviceListingLimit !== 1 ? 's' : ''}`,
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
    (async () => {
      try {
        const res = await api.get('/api/subscription/plans');
        if (res.data?.success) {
          setPlans(
            (res.data.plans || [])
              // include free plan (durationInMonths === 0, price === 0) and all paid plans
              .filter((p) => p.isActive !== false)
              .map(adaptPlan)
          );
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
            <h1>Pricing</h1>
            <h4>Affordable Plans for Every Stage of Growth</h4>
            <p>
               Our affordable monthly/annually subscription plans are structured to give you more opportunities, exposure, and the right network to boost your success in the startup ecosystem, along with more growth and access. Subscribe to a plan that will unlock everything you need to ensure your startup is able to compete and thrive in the ecosystem.
            </p>
          </div>
        </section>

        {/* Subscription Plans Grid */}
        <section className="pricingPage__pricing" id="pricing">
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Startup Plans
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '15px', marginBottom: '40px' }}>
        Choose a subscription duration that aligns with your business objectives and access to powerful dashboard that enhance visibility, engagement, networking, and growth.          
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
                {plans.map((plan) => (
                  <div key={plan._id} className="pricingPage__planCard">
                    <h2 className="pricingPage__planName">{plan.name}</h2>
                    <div className="pricingPage__planPrice">
                      <span className="pricingPage__priceAmount">
                        {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                      </span>
                      {plan.durationInMonths > 0 && (
                        <span className="pricingPage__pricePeriod">
                          / {plan.durationInMonths} month{plan.durationInMonths !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="pricingPage__planDesc">{plan.desc}</p>
                    {/* <ul className="pricingPage__featuresList">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="pricingPage__featureItem">
                          <CheckIcon />
                          {f}
                        </li>
                      ))}
                    </ul> */}
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
              <div className="pricingPage__pricingGrid pricingPage__pricingGrid--centered">
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
                          {features.map((f, idx) => (
                            <li key={idx} className="pricingPage__featureItem">
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
                <summary>Are subscription fees refundable?</summary>
                <p>Subscription fees, once a subscription has been initiated and a service associated with a plan has been delivered to you, are generally not refundable.</p>
              </details>
              <details className="pricingPage__faqItem">
                <summary>How to change my subscription plan?</summary>
                <p>You can upgrade a subscription to higher one to use more benefits like more number of listing, enhanced profile views and extra features. Any price differences shall be accounted during the upgrading of subscription.</p>
              </details>
              <details className="pricingPage__faqItem">
                <summary>What happens after subscription expires?</summary>
                <p>After expiration of a subscription any privilege and benefit associated with it, will stop being delivered. You can choose to renew the subscription at any time to make sure the ongoing service of managing your listings will not be discontinued.</p>
              </details>
              <details className="pricingPage__faqItem">
                <summary>Can we receive a refund if we do not use my subscription?</summary>
                <p>No. Subscription fees are generally non-refundable if the subscription has been successfully activated, regardless of usage. Refunds are only considered in exceptional circumstances, such as duplicate payments, incorrect multiple charges, payment processing errors, or verified billing issues.</p>
              </details>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}