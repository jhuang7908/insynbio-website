/**
 * Single source of truth for mirrored TOP navigation: InSynBio (EN) vs Therasik (ZH).
 * Update ONLY this file when adding, removing, reordering service lines, or changing URLs.
 *
 * Therasik "技术平台" product pages (Therasik_*_Page.html) intentionally stay DISTINCT:
 * T-layout, sidebar TOC, mission blocks, forms, and Chinese technical copy are NOT driven
 * by this file and must remain editorially independent from InSynBio landing pages.
 */
(function (global) {
  'use strict';
  var S = {
    services: [
      {
        id: 'antibody',
        insynbio: {
          href: 'InSynBio_Antibody_Developability_Assessment_Page.html',
          title: 'Antibody',
          desc: 'Structure-based Development',
        },
        therasik: {
          href: 'Therasik_Antibody_Page.html',
          title: '抗体评估',
          desc: '基于结构的抗体开发',
        },
      },
      {
        id: 'cart',
        insynbio: {
          href: 'InSynBio_CART_Design_Page.html',
          title: 'CAR-T',
          desc: 'Smart CAR-T Design',
        },
        therasik: {
          href: 'Therasik_CART_Page.html',
          title: 'CAR-T',
          desc: '智慧 CAR-T 设计',
        },
      },
      {
        id: 'bispecific',
        insynbio: {
          href: 'InSynBio_Bispecific_Antibody_Design_Page.html',
          title: 'Bispecific',
          desc: 'Multispecific Engineering',
        },
        therasik: {
          href: 'Therasik_Bispecific_Page.html',
          title: '双特异抗体',
          desc: '多特异性工程',
        },
      },
    ],
    insynbioOnlyServices: [
      {
        id: 'immunogenicity',
        href: 'immunogenicity_study.html',
        title: 'Immunogenicity',
        desc: 'ADA Prediction & Reference DB',
      },
      {
        id: 'vaccine',
        href: 'vaccine_design.html',
        title: 'Vaccine Design',
        desc: 'Neoantigen · Heteroclitic · mRNA',
      },
    ],
  };
  global.INSYNBIO_THERASIK_NAV = S;
})(typeof window !== 'undefined' ? window : globalThis);
