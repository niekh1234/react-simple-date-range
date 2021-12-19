/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: ['installation', 'simple-example'],
    },
    {
      type: 'category',
      label: 'Options',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: ['basic-guide', 'color-customization', 'dark-mode', 'disabled-dates'],
    },
    {
      type: 'category',
      label: 'Advanced',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [],
    },
    {
      type: 'category',
      label: 'Types',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: ['types-datecell', 'types-daterange'],
    },
  ],
};

module.exports = sidebars;
