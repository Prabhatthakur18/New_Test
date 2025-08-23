import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

const extraStyles = `
  .embroidered-text {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Premium toast animations */
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .toast-card { animation: toastIn 280ms cubic-bezier(.21,.61,.35,1); }
  .toast-close { transition: opacity .2s ease, transform .2s ease; }
  .toast-close:hover { opacity: .85; transform: scale(1.05); }
`;

const vehicleModels = ['THAR ROXX','THAR', 'XUV700', 'XUV3X0', 'SCORPIO N', 'BOLERO NEO', 'BOLERO'];
const accessories = ['Black comfort kit','Sustainable comfort kit'];
const fontStyles = [
  'Arial',
  'Georgia',
  'Segoe UI',
  'Century Gothic',
  'Impact',
  'Verdana',
  'Times New Roman'
];
const textColors = [
  { name: 'Blue', value: '#005d8f' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#d10000' },
  { name: 'Beige', value: '#ffe599' },
  { name: 'Silver', value: '#c0c0c0' }
];

// Define prices for each kit type
const kitPrices = {
  'Black comfort kit': '₹4,999',
  'Sustainable comfort kit': '₹5,999'
};

const textPositions = {
  'THAR ROXX': {
    'Front Row': {
      'Black comfort kit': [
        { top: '38%', left: '25%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '38%', left: '74%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '36.7%', left: '25%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '36.7%', left: '74%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '68.5%', left: '30.5%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '68.5%', left: '68%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '68%', left: '30%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '68%', left: '68%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },
  'THAR': {
    'Front Row': {
      'Black comfort kit': [
        { top: '45%', left: '28%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '45%', left: '72.8%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
       { top: '44.5%', left: '28.4%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '44.5%', left: '71.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56%', left: '33.6%', rotation: -0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '56%', left: '65%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '57.2%', left: '32.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57.2%', left: '65.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },
  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '30.8%', left: '28.2%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '31%', left: '75%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '30.5%', left: '28%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '31.5%', left: '75%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '61%', left: '35.3%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '61%', left: '71%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '63%', left: '32.6%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '63%', left: '69.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '35%', left: '26%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '35%', left: '72.8%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '35%', left: '25.3%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '35%', left: '72.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '63.5%', left: '28.5%', rotation: -1, fontSize: { desktop: 14, mobile: 10 } },
        { top: '63.5%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '64%', left: '30%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '64%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ]
    }
  },
  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '34%', left: '24%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '34%', left: '72.5%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '34.8%', left: '23%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '34.5%', left: '70.5%', rotation: 0, fontSize: { desktop:14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '60%', left: '26.5%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '60%', left: '70.2%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '58.5%', left: '26.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '58.5%', left: '72%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '36%', left: '27.5%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '35.8%', left: '76%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '36.4%', left: '27%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '36.4%', left: '75.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '57%', left: '32%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '57%', left: '72%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '57%', left: '33%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '35%', left: '29%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '35.2%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '36%', left: '29%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '36%', left: '69.8%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '66%', left: '30.8%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '66%', left: '66.5%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '68%', left: '31.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '68%', left: '65.8%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  }
};


const pdfTextPositions = {
  'THAR ROXX': {
    'Front Row': {
      'Black comfort kit': [
        { top: '32%', left: '25.5%', rotation: 0, fontSize: { desktop:8, mobile: 8 } },
        { top: '32%', left: '74%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '30%', left: '25%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '30%', left: '73.7%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '65%', left: '30.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '65%', left: '68%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '65%', left: '30.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '65%', left: '67.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } }
      ]
    }
  },
  'THAR': {
    'Front Row': {
      'Black comfort kit': [
        { top: '38.5%', left: '28%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '38.5%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
       { top: '38.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '38.5%', left: '71.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52%', left: '33.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '52%', left: '65.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '54%', left: '32.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '54%', left: '65.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } }
      ]
    }
  },
  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '23%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '23%', left: '74.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '23%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '23.8%', left: '75.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '55.5%', left: '35.2%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '55.5%', left: '71%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } }
      ],
      'Sustainable comfort kit': [
        { top: '58%', left: '33%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '58%', left: '70%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ]
    }
  },
  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '27.5%', left: '26.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '27.5%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '27.5%', left: '25.3%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '27.5%', left: '72.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '59.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '59.5%', left: '70%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '59.5%', left: '30.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8} },
        { top: '59.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ]
    }
  },
  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '25.5%', left: '24%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '25.5%', left: '72%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '26%', left: '23.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8  } },
        { top: '26%', left: '70.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56.5%', left: '26.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '56.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '55%', left: '27%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '55%', left: '72.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ]
    }
  },
  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '29%', left: '27.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '28.5%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '29.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
        { top: '29.5%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52.5%', left: '32%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '52.5%', left: '72%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '52.5%', left: '33%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '52.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ]
    }
  },
  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '27.5%', left: '29.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '28%', left: '70%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '29%', left: '29.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '29%', left: '69.8%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '62.5%', left: '31%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
       { top: '62.5%', left: '66.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
     ],
     'Sustainable comfort kit': [
       { top: '64%', left: '31%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
       { top: '64%', left: '66%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
     ]
   }
 }
};

const previewTextPositions  = {
  'THAR ROXX': {
    'Front Row': {
      'Black comfort kit': [
        { top: '32%', left: '25.5%', rotation: 0, fontSize: { desktop:8, mobile: 8 } },
        { top: '32%', left: '74%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '30.5%', left: '25%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
        { top: '30.5%', left: '73.7%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '64%', left: '30.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '64%', left: '68%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '65%', left: '30.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '65%', left: '67.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } }
      ]
    }
  },
  'THAR': {
    'Front Row': {
      'Black comfort kit': [
        { top: '39%', left: '28%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '39%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
       { top: '38.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '38.5%', left: '71.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52%', left: '33.8%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '52%', left: '65%', rotation: 0, fontSize: { desktop:8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '53%', left: '32.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '53%', left: '65%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } }
      ]
    }
  },
  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '23.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '23.5%', left: '74.8%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '23%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '24%', left: '75%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56.5%', left: '35.2%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '56.5%', left: '71%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } }
      ],
      'Sustainable comfort kit': [
        { top: '59%', left: '33%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '59%', left: '70%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ]
    }
  },
  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '27.7%', left: '26.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '28%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '28%', left: '25.3%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '28%', left: '72.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '59.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '59.5%', left: '70%', rotation: 0, fontSize: { desktop: 10, mobile: 8} },
      ],
      'Sustainable comfort kit': [
        { top: '59.5%', left: '30.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8} },
        { top: '59.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ]
    }
  },
  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '25.78%', left: '24%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '25.78%', left: '72%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '26.5%', left: '23.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '26.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '56.5%', left: '71%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '54.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '54.5%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    }
  },
  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '29%', left: '27.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '28.5%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '29.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
        { top: '29.5%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52%', left: '32.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '52%', left: '72%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '52.5%', left: '32.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '52.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ]
    }
  },
  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '27.5%', left: '29.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '28%', left: '70%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '29%', left: '29.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '29%', left: '69.8%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '62.5%', left: '31%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
       { top: '62.5%', left: '66.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
     ],
     'Sustainable comfort kit': [
       { top: '64%', left: '31%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
       { top: '64%', left: '66%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
     ]
   }
 }
};

const loadFonts = async () => {
 const style = document.createElement('style');
 style.textContent = `
   @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Montserrat:wght@400;700&display=swap');
   
   @font-face {
     font-family: 'Gabriola';
     src: local('Gabriola'), local('Segoe Script');
   }
   
   @font-face {
     font-family: 'Blackadder ITC';
     src: local('Blackadder ITC'), local('Brush Script MT');
   }
 `;
 document.head.appendChild(style);

 await document.fonts.ready;
};

const EmbroideredText = ({ text, fontFamily, position, textColor, isMobile }) => {
 const uniqueId = `text-${position.top}-${position.left}-${Math.random().toString(36).substring(2, 9)}`;

 const getStrokeColor = (color) => {
   const hexToRgb = (hex) => {
     const r = parseInt(hex.slice(1, 3), 16);
     const g = parseInt(hex.slice(3, 5), 16);
     const b = parseInt(hex.slice(5, 7), 16);
     return [r, g, b];
   };

   const calculateLuminance = (r, g, b) => {
     const a = [r, g, b].map(v => {
       v /= 255;
       return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
     });
     return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
   };

   if (color.startsWith('#')) {
     const [r, g, b] = hexToRgb(color);
     const luminance = calculateLuminance(r, g, b);
     return luminance > 0.5 ? 'rgba(68, 68, 68, 0.5)' : 'rgba(48, 47, 47, 0.5)';
   }
   const lightColors = ['#ffe599', '#c0c0c0', 'beige', 'ivory', 'white'];
   return lightColors.includes(color.toLowerCase()) 
     ? 'rgba(58, 55, 55, 0.5)' 
     : 'rgba(255, 255, 255, 0.5)';
 };

 const strokeColor = getStrokeColor(textColor);
 
 const fontSize = position.fontSize 
   ? (isMobile ? position.fontSize.mobile : position.fontSize.desktop)
   : (isMobile ? 10 : 14);

 return (
   <div
     id={uniqueId}
     className="embroidered-text"
     style={{
       position: 'absolute',
       top: position.top,
       left: position.left,
       transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`,
       fontFamily: `"${fontFamily}"`,
       fontSize: `${fontSize}px`,
       color: textColor,
       fontStyle: 'italic',
       fontWeight: 'bold',
       WebkitTextStroke: `0.3px ${strokeColor}`,
       textShadow: `
         1px 1px 1px rgba(33, 33, 33, 0.28),
         -1px -1px 1px rgba(71, 71, 71, 0.56),
         0 0 2px rgba(37, 36, 36, 0.3)
       `,
       pointerEvents: 'none',
       whiteSpace: 'nowrap',
       zIndex: 10
     }}
   >
     {text}
   </div>
 );
};

const OrderForm = ({ 
 onClose, 
 selectedVehicleModel,
 selectedSeatView,
 selectedAccessory,
 personalisedContent,
 selectedFont,
 selectedColor,
 numSets,
 imageRef,
 pushToast
}) => {
 
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  // customer address & email removed per requirement
  const [BookingID , setBookingID ] = useState('');
  //  const [partNumber, setPartNumber] = useState('');
  const [dealershipName, setDealershipName] = useState('');
  const [dealershipAddress, setDealershipAddress] = useState('');
  const [dealershipPhone, setDealershipPhone] = useState('');
  const [dealershipManager, setDealershipManager] = useState('');
  const [dealershipLocation, setDealershipLocation] = useState('');
  const [errors, setErrors] = useState({});
  const sanitizeDigits = (s) => (s || '').replace(/\D/g, '');
const isValidPhone = (s) => /^\d{10}$/.test(s || '');
 // track fields locked (disabled) after user click — dealership will fill these
 const [lockedFields, setLockedFields] = useState({});

 // modern badge style for "Filled by Dealership only"
 const badgeStyle = {
   marginLeft: '10px',
   background: 'linear-gradient(90deg,#eef6ff,#f7fbff)',
   color: '#035388',
   border: '1px solid rgba(3,83,136,0.08)',
   padding: '4px 8px',
  borderRadius: '12px',
   fontSize: '12px',
   fontWeight: 600,
   display: 'inline-block',
   boxShadow: '0 2px 8px rgba(3,83,136,0.06)'
 };

// lock a field (called onFocus/onClick) — blur to prevent typing and mark as disabled
const lockField = (fieldName, e) => {
  try { e?.target?.blur?.(); } catch {}
  setLockedFields(prev => ({ ...prev, [fieldName]: true }));
};
 // track temporary marked fields while the dealership-toast is visible
 const [markedFields, setMarkedFields] = useState({});

 // local toast state so OrderForm toasts appear while OrderForm is mounted standalone
 const [localToasts, setLocalToasts] = useState([]);
 const localPushToast = (message, variant = 'info', timeoutMs = 3000, onClose) => {
   const id = Date.now() + Math.random();
   setLocalToasts(prev => [...prev, { id, message, variant, onClose }]);
   window.setTimeout(() => {
     setLocalToasts(prev => {
       const removed = prev.find(t => t.id === id);
       if (removed && typeof removed.onClose === 'function') {
         try { removed.onClose(); } catch (err) { console.error(err); }
       }
       return prev.filter(t => t.id !== id);
     });
   }, timeoutMs);
 };
 
 // handle click/focus on dealership-only fields:
 // - mark the field (red border + temporary disabled)
 // - fire an app-toast (right side) that says "Filled by dealership only"
 // - when toast auto-closes (or user dismisses) the mark is removed
 const handleDealershipFieldClick = (fieldName, e) => {
   if (markedFields[fieldName]) return; // already marked/shown
   try { e?.target?.blur?.(); } catch {}
   setMarkedFields(prev => ({ ...prev, [fieldName]: true }));

   // use local toast so notification is visible even when OrderForm is returned directly
   localPushToast(
     'This field must be filled by the dealership only.',
     'info',
     3000,
     () => setMarkedFields(prev => {
       const copy = { ...prev };
       delete copy[fieldName];
       return copy;
     })
   );
 };
 
  const orderFormRef = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
 
  // Order Request flow
  const [showTerms, setShowTerms] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const generateRandomAlphaNum = (length = 8) => {
   const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
   let out = '';
   for (let i = 0; i < length; i++) {
     out += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return out;
 };

 // Dummy dropdown data for dealers
 const dealerDirectory = [
   { name: 'Mahindra Downtown', manager: 'Amit Sharma', location: 'Mumbai', address: '123 MG Road, Mumbai' },
   { name: 'Mahindra Prime Motors', manager: 'Neha Gupta', location: 'Pune', address: '45 FC Road, Pune' },
   { name: 'Mahindra North Star', manager: 'Rahul Mehta', location: 'Bengaluru', address: '12 Indiranagar, Bengaluru' }
 ];
 const dealerNames = dealerDirectory.map(d => d.name);
 const dealerManagers = dealerDirectory.map(d => d.manager);
 const dealerLocations = dealerDirectory.map(d => d.location);
 const dealerAddresses = dealerDirectory.map(d => d.address);

 useEffect(() => {
   loadFonts().then(() => {
     setFontsLoaded(true);
   });

   const handleResize = () => {
     setIsMobile(window.innerWidth <= 768);
   };
   handleResize();
   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);

 useEffect(() => {
   // Auto-generate on first mount if empty
   if (!orderNo) setOrderNo(`ORD-${generateRandomAlphaNum(8)}`);
  //  if (!BookingID) setBookingID(`BK-${generateRandomAlphaNum(8)}`);
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 useEffect(() => {
   if (!dealershipName) return;
   const selected = dealerDirectory.find(d => d.name === dealershipName);
   if (selected) {
     setDealershipManager(selected.manager);
     setDealershipLocation(selected.location);
     setDealershipAddress(selected.address);
   }
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [dealershipName]);

 useEffect(() => {
   if (!showThanks) return;
   const id = window.setTimeout(() => {
     window.location.assign('/');
   }, 2000);
   return () => window.clearTimeout(id);
 }, [showThanks]);

const validateForm = () => {
  if (!customerName.trim()) {
    localPushToast('Please enter Customer Name.', 'error');
    const firstField = document.querySelector('[name="customerName"]');
    if (firstField) firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  if (!isValidPhone(customerPhone)) {
    localPushToast('Enter a valid 10-digit Customer Phone.', 'error');
    const firstField = document.querySelector('[name="customerPhone"]');
    if (firstField) firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
};

 const getInputStyle = (fieldName) => ({
   width: '100%',
   padding: '8px 12px',
   border: errors[fieldName] ? '2px solid red' : '1px solid #ddd',
   borderRadius: '4px',
   fontSize: '14px'
 });

 const inputStyle = {
   border: 'none',
   borderBottom: '1px solid #000',
   outline: 'none',
   background: 'transparent',
   fontSize: '12px',
   padding: '2px 0',
   width: '100%'
 };

 const textareaStyle = {
   ...inputStyle,
   resize: 'none',
   height: '20px',
   marginTop: '0px'
 };

 const dividerStyle = {
   width: '1.5px',
   backgroundColor: '#003366',
   alignSelf: 'stretch'
 };


// Load a Unicode font so ₹ renders correctly
const fetchAsBase64 = async (url) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

let rupeeFontLoaded = false;
const ensureRupeeFont = async (pdf) => {
  if (rupeeFontLoaded) return;
  const base64 = await fetchAsBase64('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/fonts/Roboto-Regular.ttf');
  pdf.addFileToVFS('Roboto-Regular.ttf', base64);
  pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  rupeeFontLoaded = true;
};

// Add images safely (auto-detect PNG/JPEG)
const addImageFromUrl = async (pdf, url, x, y, w, h) => {
  const res = await fetch(url);
  const blob = await res.blob();
  const dataUrl = await new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
  const isPng = blob.type.includes('png');
  pdf.addImage(dataUrl, isPng ? 'PNG' : 'JPEG', x, y, w, h);
};


const handleDownloadOrder = async () => {
if (!orderFormRef.current) return;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let currentY = 10;

    const labelColor = [0, 0, 0];
    const valueColor = [80, 80, 80];
    const sectionBg = [245, 245, 245];

    const formattedDate = new Date(orderDate).toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(/\//g, ' - ');

    // Mahindra logo
// Page dimensions
// const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();

// Margins
const marginLeft = 3.5;
const marginTop =2.5;
const marginRight = 10;
const marginBottom = 0;

// Available space inside margins
const availableWidth = pageWidth - marginLeft - marginRight;
const availableHeight = pageHeight - marginTop - marginBottom;

const logoResponse = await fetch('/loogo.png');
const logoBlob = await logoResponse.blob();
const logoDataUrl = await new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.readAsDataURL(logoBlob);
});

const img = new Image();
img.src = logoDataUrl;

await new Promise(resolve => {
  img.onload = resolve;
});

// Natural size
let logoWidth = img.width;
let logoHeight = img.height;
const aspectRatio = logoWidth / logoHeight;

// Desired max logo size (mm)
const maxWidth = 40;
const maxHeight = 40;

// Scale within max size
if (logoWidth > maxWidth) {
  logoWidth = maxWidth;
  logoHeight = logoWidth / aspectRatio;
}
if (logoHeight > maxHeight) {
  logoHeight = maxHeight;
  logoWidth = logoHeight * aspectRatio;
}

// Also check page available space
if (logoWidth > availableWidth) {
  logoWidth = availableWidth;
  logoHeight = logoWidth / aspectRatio;
}
if (logoHeight > availableHeight) {
  logoHeight = availableHeight;
  logoWidth = logoHeight * aspectRatio;
}

// Position: top-left inside margins
const x = marginLeft;
const y = marginTop;

// Add logo
pdf.addImage(logoDataUrl, 'PNG', x, y, logoWidth, logoHeight);



    // Order info
    pdf.setFontSize(10);
    pdf.setTextColor(...valueColor);
    pdf.text(`Order No : ${orderNo}`, pageWidth - margin, currentY + 6, { align: 'right' });
    pdf.text(`Date : ${formattedDate}`, pageWidth - margin, currentY + 12, { align: 'right' });

    currentY += 18;
    pdf.setDrawColor(255, 153, 153);
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 4;

    const addSectionHeader = (title) => {
      pdf.setFillColor(...sectionBg);
      pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');
      pdf.setTextColor(...labelColor);
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(title, margin + 1, currentY + 5.5);
      currentY += 12;
    };

    // Add Dealer & Customer Section
    addSectionHeader('DEALER & CUSTOMER DETAILS');

    const dealerX = margin;
    const customerX = pageWidth / 2 + 5;
    let dealerY = currentY + 3;
    let customerY = currentY + 3;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(...labelColor);
    pdf.text('DEALER INFORMATION', dealerX, dealerY);
    pdf.text('CUSTOMER INFORMATION', customerX, customerY);
    dealerY += 6;
    customerY += 6;

    const addLabelValue = (label, value, x, y, labelWidth = 45) => {
      const safeValue = (value && value !== 'N/A') ? value : '';
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(...labelColor);
      pdf.text(label, x, y);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(...valueColor);
      pdf.text(safeValue, x + labelWidth, y);
    };

    const addLabelValueWithWrap = (label, value, x, y, labelWidth = 45, maxWidth = 80) => {
      const safeValue = (value && value !== 'N/A') ? value : '';
      
      // Add label
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(...labelColor);
      pdf.text(label, x, y);
      
      if (safeValue) {
        pdf.setFont(undefined, 'normal');
        pdf.setTextColor(...valueColor);
        
        // Split text to fit within available width
        const availableWidth = maxWidth - labelWidth;
        const lines = pdf.splitTextToSize(safeValue, availableWidth);
        
        // Place text starting from the same line as label, then wrap if needed
        const valueX = x + labelWidth;
        for (let i = 0; i < lines.length; i++) {
          pdf.text(lines[i], valueX, y + (i * 4));
        }
        
        return Math.max(lines.length * 4, 5); // Return height used (minimum 5 for single line)
      }
      return 5; // Default height for label only
    };

    // Dealer info
    addLabelValue('Dealer Name :', dealershipName, dealerX, dealerY);
    dealerY += 5;
    addLabelValue('Dealer Access Manager :', dealershipManager, dealerX, dealerY);
    dealerY += 5;
    addLabelValue('Dealer Location :', dealershipLocation, dealerX, dealerY);
    dealerY += 5;

    // Use new function for dealer address with proper wrapping
    const dealerAddrHeight = addLabelValueWithWrap('Dealer Address :', dealershipAddress, dealerX, dealerY, 45, 80);
    dealerY += dealerAddrHeight;
        addLabelValue('Booking ID :', BookingID, dealerX, dealerY);
dealerY += 5;

    // Customer info - Updated labels
    addLabelValue('Customer Name :', customerName, customerX, customerY);
    customerY += 5;
    addLabelValue('Customer Phone :', customerPhone, customerX, customerY);
    customerY += 5;
  
    
    // Part Number (if needed)
    // addLabelValue('Part No. :', partNumber, customerX, customerY);
    // customerY += 5;

    currentY = Math.max(dealerY, customerY) + 2;
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 4;

    // VEHICLE & PERSONALIZATION
    addSectionHeader('VEHICLE & PERSONALIZATION');
    addLabelValue('Vehicle Model :', selectedVehicleModel, margin, currentY);
    addLabelValue('Accessory Kit :', selectedAccessory, pageWidth / 2 + 5, currentY);
    currentY += 6;
    addLabelValue('Personalized Text :', personalisedContent, margin, currentY);
    addLabelValue('Font Style :', selectedFont, pageWidth / 2 + 5, currentY);
    currentY += 6;
    const textColorName = textColors.find(c => c.value === selectedColor)?.name || selectedColor;
    addLabelValue('Thread Color :', textColorName, margin, currentY);
    const boxSize = 5;
    const boxX = margin + 45 + pdf.getTextWidth(textColorName) + 3;
    const boxY = currentY - 3.5;

    pdf.setDrawColor(0);
    pdf.setFillColor(selectedColor);
    pdf.roundedRect(boxX, boxY, boxSize, boxSize, 1.5, 1.5, 'F');
    addLabelValue('Quantity :', numSets.toString(), pageWidth / 2 + 5, currentY);
    
    // Add price information
    currentY += 6;
const unitPrice = selectedAccessory
  ? parseInt(kitPrices[selectedAccessory].replace(/[^\d]/g, ''))
  : 0;
const totalPrice = unitPrice * (Number(numSets) || 1);

// Draw label with default font
pdf.setFontSize(10);
pdf.setFont(undefined, 'bold');
pdf.setTextColor(...labelColor);
pdf.text('MRP :', margin, currentY);

// Value with Unicode font to render ₹
// Fallback to 'Rs.' if font load fails
let priceText = `₹${totalPrice.toLocaleString()} (inclusive of all taxes)`;
try {
  await ensureRupeeFont(pdf);
  pdf.setFont('Roboto', 'normal');
} catch (e) {
  priceText = `Rs. ${totalPrice.toLocaleString()} (inclusive of all taxes)`;
  pdf.setFont(undefined, 'normal');
}
pdf.setTextColor(...valueColor);
pdf.text(priceText, margin + 45, currentY);

// Optional: reset to default font afterwards
pdf.setFont(undefined, 'normal');

currentY += 8;
pdf.line(margin, currentY, pageWidth - margin, currentY);
currentY += 4;

    // DESIGN PREVIEW
    addSectionHeader('DESIGN PREVIEW');

    const captureSeatView = async (seatView) => {
      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.width = '500px';
      element.style.height = '390px';
      document.body.appendChild(element);

      const img = document.createElement('img');
      img.src = `/models/${selectedVehicleModel}/${seatView}/${selectedAccessory}.png`;
      img.style.width = '100%';
      img.style.height= '100%';
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      element.appendChild(img);

      await new Promise(resolve => img.onload = resolve);

      const positions = pdfTextPositions[selectedVehicleModel]?.[seatView]?.[selectedAccessory] || [];
      positions.forEach(position => {
        const textEl = document.createElement('div');
        textEl.textContent = personalisedContent;
        textEl.style.position = 'absolute';
        textEl.style.top = position.top;
        textEl.style.left = position.left;
        textEl.style.transform = `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`;
        textEl.style.fontFamily = selectedFont;
        textEl.style.fontSize = `${position.fontSize?.desktop || 6}px`;
        textEl.style.color = selectedColor;
        textEl.style.fontStyle = 'italic';
        textEl.style.fontWeight = 'bold';
        textEl.style.WebkitTextStroke = '0.3px rgba(68, 68, 68, 0.5)';
        textEl.style.textShadow = `1px 1px 1px rgba(33, 33, 33, 0.28), -1px -1px 1px rgba(71, 71, 71, 0.56), 0 0 2px rgba(37, 36, 36, 0.3)`;
        textEl.style.pointerEvents = 'none';
        textEl.style.whiteSpace = 'nowrap';
        element.appendChild(textEl);
      });

      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, allowTaint: true, backgroundColor: null });
      document.body.removeChild(element);
      return canvas.toDataURL('image/jpeg', 0.95);
    };

    const [frontImage, rearImage] = await Promise.all([
      captureSeatView('Front Row'),
      captureSeatView('Rear Row')
    ]);

    const imgW = (pageWidth - 2 * margin - 10) / 2;
    const img1 = new Image(); img1.src = frontImage;
    const img2 = new Image(); img2.src = rearImage;
    await Promise.all([img1.decode(), img2.decode()]);
    const h1 = (img1.height / img1.width) * imgW;
    const h2 = (img2.height / img2.width) * imgW;
    const imgH = Math.max(h1, h2);
    pdf.addImage(frontImage, 'JPEG', margin, currentY, imgW, h1);
    pdf.text('Front Row', margin + imgW / 2, currentY + h1 + 5, { align: 'center' });
    pdf.addImage(rearImage, 'JPEG', margin + imgW + 10, currentY, imgW, h2);
    pdf.text('Rear Row', margin + imgW + 10 + imgW / 2, currentY + h2 + 5, { align: 'center' });
    currentY += imgH + 12;

    // DEALERSHIP AUTHENTICATION
    addSectionHeader('DEALERSHIP AUTHENTICATION');
    pdf.setFontSize(8);
    pdf.setTextColor(...valueColor);
    pdf.text(
      'Please affix the official dealership seal and provide an authorized signature below to validate this personalization.',
      margin, currentY
    );
    currentY += 12;

    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...labelColor);
    pdf.text('Authorized Representative Name:', margin, currentY);
    currentY += 6;
    pdf.text('Signature:', margin, currentY);
    currentY += 6;
    pdf.text('Date:', margin, currentY);
    currentY += 9;

    pdf.setFont(undefined, 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 0, 0);
    pdf.text('Note: Personalization will not be processed without dealership authentication.', margin, currentY);
    currentY += 9;

    // DELIVERY TIMELINE NOTICE
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...labelColor);
    pdf.text('Delivery Timeline Notice', margin, currentY);
    currentY += 5;

    const deliveryText =
      'Please note: Personalized orders may require additional processing time. Delivery timelines may vary depending on the nature of customization and your location. We appreciate your patience as we ensure your SUV reflects your unique style with precision and care.';
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    const lines = pdf.splitTextToSize(deliveryText, pageWidth - 2 * margin);
    pdf.text(lines, margin, currentY);
    currentY += lines.length * 4 + 4;

    // FOOTER
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Generated by Mahindra Personalization Tool', margin, 290);
    pdf.text(`${orderNo} - ${formattedDate}`, pageWidth - margin, 290, { align: 'right' });
    pdf.setDrawColor(255, 153, 153);
    pdf.line(margin, 292, pageWidth - margin, 292);

    const filename = `Mahindra_Order_${orderNo || 'ORDER'}_${formattedDate.replace(/ /g, '-')}.pdf`;
    pdf.save(filename);

  } catch (err) {
    console.error('PDF generation failed:', err);
    alert('Something went wrong while generating the PDF.');
  }
};

 return (
   <div style={{
     position: 'fixed',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     zIndex: 1000,
     padding: '20px'
   }}>
     <div
       ref={orderFormRef}
       style={{
         backgroundColor: 'white',
         padding: '30px',
         borderRadius: '8px',
         maxWidth: '900px',
         width: '100%',
         maxHeight: '90vh',
         overflowY: 'auto',
         position: 'relative'
       }}
     >
       {/* Close Button */}
       <button
         onClick={onClose}
         style={{
           position: 'absolute',
           top: '15px',
           right: '15px',
           width: '30px',
           height: '30px',
           borderRadius: '20%',
           border: 'none',
           fontSize: '20px',
           cursor: 'pointer',
           color: '#fff',
           backgroundColor: '#dd052b',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
         }}
       >
         ×
       </button>

       {/* Header with Logo and Centered Title */}
       <div
         style={{
           position: 'relative',
           display: 'flex',
           alignItems: 'center',
           marginBottom: '10px',
           paddingBottom: '0px',
           borderBottom: '2px solid #e0e0e0',
           height: '60px'
         }}
       >
         <img
           src="/logooo.png"
           alt="Mahindra Logo"
           style={{
             height: '30px',
             marginRight: '20px'
           }}
         />

         <h2
           style={{
             position: 'absolute',
             left: '50%',
             transform: 'translateX(-50%)',
             margin: 0,
             color: 'rgb(221, 5, 43)',
             fontSize: '24px',
             fontWeight: 'bold'
           }}
         >
           Personalization Order details
         </h2>
       </div>

       {/* Order Number and Date - Top Right */}
       <div
         style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'flex-end',
           gap: '10px',
           marginBottom: '5px',
           textAlign: 'right',
           right: '30px'
         }}
       >
         {/* Order Number Row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <label
    style={{
      fontSize: '14px',
      fontWeight: 'bold',
      marginRight: '10px',
      minWidth: '110px',
    }}
  >
    Order Number :
  </label>
  <input
    name="orderNo"
    type="text"
    value={orderNo}
    readOnly   // 👈 makes it non-editable but still selectable/copyable
    style={{
      ...getInputStyle('orderNo'),
      width: '100px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5', // light grey background for clarity
      cursor: 'not-allowed',      // cursor indicates it's not editable
    }}
  />
</div>


         {/* Order Date Row */}
         <div style={{ display: 'flex', alignItems: 'center' }}>
           <label
             style={{
               fontSize: '14px',
               fontWeight: 'bold',
               marginRight: '10px',
               minWidth: '110px'
             }}
           >
             Order Date :
           </label>
           <input
             type="date"
             value={orderDate}
             onChange={(e) => setOrderDate(e.target.value)}
             style={{
               ...getInputStyle('orderDate'),
               width: '100px',
               textAlign: 'center'
             }}
           />
         </div>
       </div>

       {/* Main Content Area */}
       <div style={{ borderTop: '2px solid #005d8f', paddingTop: '0px' }}>
         <div
           style={{
             display: 'flex',
             padding: '20px 0',
             gap: '0px',
             alignItems: 'flex-start'
           }}
         >
           {/* Dealer Info */}
       <div style={{ flex: 1, paddingRight: '20px' }}>
  {/* Dealer Name */}
  <div
    className="tooltip-wrapper"
    style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}
  >
    <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Dealer Name :</label>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <input
        name="dealershipName"
        type="text"
        value={dealershipName}
        readOnly // non-editable
        style={{
          ...inputStyle,
          borderBottom: '1px solid #000',
          padding: '4px 0',
          backgroundColor: '#f5f5f5',
          cursor: 'not-allowed',
        }}
      />
    </div>
    <span className="tooltip-text">For Office Use Only</span>
  </div>

  {/* Accessory Manager */}
  <div
    className="tooltip-wrapper"
    style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}
  >
    <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Accessory Manager :</label>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <input
        name="dealershipManager"
        type="text"
        value={dealershipManager}
        readOnly
        style={{
          ...inputStyle,
          borderBottom: '1px solid #000',
          padding: '4px 0',
          backgroundColor: '#f5f5f5',
          cursor: 'not-allowed',
        }}
      />
    </div>
    <span className="tooltip-text">For Office Use Only</span>
  </div>

  {/* Dealer Location */}
  <div
    className="tooltip-wrapper"
    style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}
  >
    <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Dealer Location :</label>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <input
        name="dealershipLocation"
        type="text"
        value={dealershipLocation}
        readOnly
        style={{
          ...inputStyle,
          borderBottom: '1px solid #000',
          padding: '4px 0',
          backgroundColor: '#f5f5f5',
          cursor: 'not-allowed',
        }}
      />
    </div>
    <span className="tooltip-text">For Office Use Only</span>
  </div>

  {/* Dealer Address */}
  <div
    className="tooltip-wrapper"
    style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}
  >
    <label style={{ fontWeight: 'bold', minWidth: '140px', whiteSpace: 'nowrap' }}>Dealer Address :</label>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <input
        name="dealershipAddress"
        type="text"
        value={dealershipAddress}
        readOnly
        style={{
          ...inputStyle,
          borderBottom: '1px solid #000',
          padding: '4px 0',
          backgroundColor: '#f5f5f5',
          cursor: 'not-allowed',
        }}
      />
    </div>
    <span className="tooltip-text">For Office Use Only</span>
  </div>

  {/* Booking ID */}
  <div
    className="tooltip-wrapper"
    style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}
  >
    <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Booking ID :</label>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <input
        name="BookingID"
        type="text"
        value={BookingID}
        readOnly
        style={{
          ...inputStyle,
          borderBottom: '1px solid #000',
          backgroundColor: '#f5f5f5',
          cursor: 'not-allowed',
        }}
      />
    </div>
    <span className="tooltip-text">For Office Use Only</span>
  </div>
</div>

<style>
{`
  .tooltip-text {
    visibility: hidden;
    opacity: 0;
    font-size: 11px;
    background-color: #333;
    color: #fff;
    padding: 3px 6px;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    bottom: -25px;
    transform: translateX(-50%);
    white-space: nowrap;
    transition: opacity 0.3s;
    z-index: 10;
  }

  .tooltip-wrapper:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`}
</style>

 
           {/* Divider */}
           <div style={dividerStyle} />

           {/* Customer Info */}
           <div style={{ flex: 1, padding: '0 20px' }}>
             <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Customer Name :</label>
<input 
  name="customerName"
  type="text" 
  value={customerName} 
  onChange={(e) => setCustomerName(e.target.value)} 
  placeholder="Enter Customer Name"
  style={inputStyle}
/>
             </div>

             <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Customer Phone :</label>
<input 
  name="customerPhone"
  type="tel" 
  inputMode="numeric"
  pattern="[0-9]*"
  value={customerPhone} 
  onChange={(e) => {
    const digits = sanitizeDigits(e.target.value).slice(0, 10);
    setCustomerPhone(digits);
  }} 
  placeholder="Enter Customer Phone Number"
  style={inputStyle}
/>
             </div>

             {/* <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '12px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px', marginTop: '6px', whiteSpace: 'nowrap' }}>Customer Address:</label>
               <textarea 
                 value={customerAddress} 
                 onChange={(e) => setCustomerName(e.target.value)} 
                 style={textareaStyle} 
               />
             </div> */}

             {/* <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Customer Email :</label>
               <input 
                 type="email" 
                 value={customerEmail} 
                 onChange={(e) => setCustomerEmail(e.target.value)} 
                 style={inputStyle} 
               />
             </div> */}

             {/* Booking ID removed from Customer column — now placed under Dealer Address */}
           </div>

           {/* Divider */}
           <div style={dividerStyle} />

           {/* Vehicle Info */}
           <div style={{ flex: 1, paddingLeft: '20px' }}>
             <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Vehicle Model :</label>
               <span>{selectedVehicleModel}</span>
             </div>

             <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Accessory :</label>
               <span>{selectedAccessory}</span>
             </div>

             <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Text Content :</label>
               <span>{personalisedContent}</span>
             </div>

             <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Font :</label>
               <span>{selectedFont}</span>
             </div>

             <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Thread :</label>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span
                   style={{
                     width: '16px',
                     height: '16px',
                     backgroundColor: selectedColor,
                     border: '1px solid #ccc',
                     borderRadius: '3px'
                   }}
                 />
                 <span>{textColors.find((c) => c.value === selectedColor)?.name || selectedColor}</span>
               </div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
               <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Qty :</label>
               <span>{numSets}</span>
             </div>

<div
  style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '4px',
    marginTop: '12px',
  }}
>
  <label style={{ fontWeight: 'bold', minWidth: '140px' }}>MRP :</label>

  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '2px',
    }}
  >
    {/* Price value */}
    <span
      style={{
        fontWeight: 'bold',
        color: '#1c1b1bff',
        fontSize: '16px',
      }}
    >
      {selectedAccessory
        ? `₹${(
            parseInt(kitPrices[selectedAccessory].replace(/[^\d]/g, '')) *
            numSets
          ).toLocaleString()}`
        : '--/--'}
    </span>

    {/* Inclusive text below the value */}
    {selectedAccessory && (
      <span
        style={{
          fontWeight: 'normal',
          color: '#666',
          fontSize: '12px',
        }}
      >
        (Inclusive of all taxes)
      </span>
    )}
  </div>
</div>



           </div>
         </div>
       </div>

{/* Design Preview Section */}
       <div style={{ 
         marginTop: '30px',
         textAlign: 'center',
         borderTop: '2px solid #e0e0e0',
         paddingTop: '20px'
       }}>
         <div style={{ 
           display: 'flex', 
           justifyContent: 'center', 
           gap: '40px',
           flexWrap: 'wrap'
         }}>
           {/* Front Row Image */}
           <div>
             <h4 style={{ 
               marginBottom: '10px',
               color: '#d61616ff',
               fontSize: '16px',
               fontWeight: 'bold'
             }}>
               Front Row
             </h4>
             <div style={{ 
               position: 'relative', 
               display: 'inline-block',
               width: '380px',
               height: '300px',
               border: '2px solid ',
               borderRadius: '8px',
               overflow: 'hidden'
             }}>
               <img
                 src={`/models/${selectedVehicleModel}/Front Row/${selectedAccessory}.png`}
                 alt="Front Row Preview"
                 style={{
                   width: '100%',
                   height: '100%',
                 }}
               />
               {fontsLoaded && personalisedContent && previewTextPositions[selectedVehicleModel]?.['Front Row']?.[selectedAccessory]?.map((position, index) => {
                 const fontSize = position.fontSize 
                   ? (isMobile ? position.fontSize.mobile : position.fontSize.desktop)
                   : (isMobile ? 16 : 22);

                 return (
                   <div
                     key={`front-${index}`}
                     style={{
                       position: 'absolute',
                       top: position.top,
                       left: position.left,
                       transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`,
                       fontFamily: `"${selectedFont}"`,
                       fontSize: `${fontSize}px`,
                       color: selectedColor,
                       fontStyle: 'italic',
                       fontWeight: 'bold',
                       WebkitTextStroke: '0.5px rgba(68, 68, 68, 0.5)',
                       textShadow: `
                         1px 1px 1px rgba(33, 33, 33, 0.28),
                         -1px -1px 1px rgba(71, 71, 71, 0.56),
                         0 0 2px rgba(37, 36, 36, 0.3)
                       `,
                       pointerEvents: 'none',
                       whiteSpace: 'nowrap',
                       zIndex: 10
                     }}
                   >
                     {personalisedContent}
                   </div>
                 );
               })}
             </div>
           </div>

           {/* Rear Row Image */}
           <div>
             <h4 style={{ 
               marginBottom: '10px',
               color: '#d61616ff',
               fontSize: '16px',
               fontWeight: 'bold'
             }}>
               Rear Row
             </h4>
             <div style={{ 
               position: 'relative', 
               display: 'inline-block',
               width: '380px',
               height: '300px',
               border: '2px solid ',
               borderRadius: '8px',
               overflow: 'hidden'
             }}>
               <img
                 src={`/models/${selectedVehicleModel}/Rear Row/${selectedAccessory}.png`}
                 alt="Rear Row Preview"
                 style={{
                   width: '100%',
                   height: '100%',
                 }}
               />
               {fontsLoaded && personalisedContent && previewTextPositions[selectedVehicleModel]?.['Rear Row']?.[selectedAccessory]?.map((position, index) => {
                 const fontSize = position.fontSize 
                   ? (isMobile ? position.fontSize.mobile : position.fontSize.desktop)
                   : (isMobile ? 16 : 22);
                 
                 return (
                   <div
                     key={`rear-${index}`}
                     style={{
                       position: 'absolute',
                       top: position.top,
                       left: position.left,
                       transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`,
                       fontFamily: `"${selectedFont}"`,
                       fontSize: `${fontSize}px`,
                       color: selectedColor,
                       fontStyle: 'italic',
                       fontWeight: 'bold',
                       WebkitTextStroke: '0.5px rgba(68, 68, 68, 0.5)',
                       textShadow: `
                         1px 1px 1px rgba(33, 33, 33, 0.28),
                         -1px -1px 1px rgba(71, 71, 71, 0.56),
                         0 0 2px rgba(37, 36, 36, 0.3)
                       `,
                       pointerEvents: 'none',
                       whiteSpace: 'nowrap',
                       zIndex: 10
                     }}
                   >
                     {personalisedContent}
                   </div>
                 );
                                                                               })}
             </div>
           </div>
         </div>
       </div>

       {/* Order Request */}
       <div style={{ 
         marginTop: '30px',
         textAlign: 'center',
         borderTop: '2px solid #e0e0e0',
         paddingTop: '20px'
       }}>
<button
  type="button"
onClick={() => {
  if (!customerName.trim()) {
    localPushToast('Please enter Customer Name.', 'error');
    return;
  }
  if (!isValidPhone(customerPhone)) {
    localPushToast('Enter a valid 10-digit Customer Phone.', 'error');
    return;
  }
  setTermsChecked(false);
  setShowTerms(true);
}}
  className="custom-button sliding-fill"
>
  Place Order
</button>
       </div>

       {/* Terms & Conditions Dialog */}
{showTerms && (
<div className="popup-overlay">
  <div
    className="popup-box"
    style={{
      maxWidth: '560px',
      backgroundColor: '#fff',
      color: '#111',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
    }}
  >
    <h3
      style={{
        marginTop: 0,
        marginBottom: '10px',
        color: '#003366',
        textAlign: 'center',
      }}
    >
      Terms & Conditions
    </h3>

 <ul
  style={{
    marginBottom: '16px',
    color: '#333',
    lineHeight: 1.8,
    listStylePosition: 'outside', // keeps bullets outside
    paddingLeft: '20px',          // ensures space between bullet and text
    textAlign: 'justify',         // justify text left and right
  }}
>
  <li>Once the order is confirmed, it cannot be cancelled.</li>
  <li>
    The images represent the actual product, though the color of the image and
    product may slightly differ.
  </li>
  <li>
    The product will be delivered within 7 working days from the date of order
    confirmation.
  </li>
  <li>The product is non-returnable and non-refundable.</li>
</ul>


    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
      }}
    >
      <input
        type="checkbox"
        checked={termsChecked}
        onChange={(e) => setTermsChecked(e.target.checked)}
      />
      <span>I agree to the terms and conditions.</span>
    </label>

    <div
      style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
      }}
    >
      <button
        onClick={() => setShowTerms(false)}
        style={{
          border: '1px solid #E5E7EB',
          background: '#FFFFFF',
          color: '#374151',
          padding: '8px 14px',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
  <button
  disabled={!termsChecked}
onClick={async () => {
  setShowTerms(false);
  if (!validateForm()) return;
  await handleDownloadOrder();
  setShowThanks(true);
}}
  style={{
    background: '#dd052b',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: termsChecked ? 'pointer' : 'not-allowed',
    opacity: termsChecked ? 1 : 0.6,
  }}
>
  Confirm Order
</button>
    </div>
  </div>
</div>


)}


       {/* Thank You Popup */}
       {showThanks && (
         <div className="popup-overlay">
           <div className="popup-box" style={{ background: '#fff', color: '#111', borderRadius: '10px', padding: '20px', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
             <p style={{ margin: 0 }}>Thank you for your Order.</p>
             <div style={{ marginTop: '14px', textAlign: 'right' }}>
               <button
                 onClick={() => window.location.assign('/')}
                 style={{
                   background: '#dd052b',
                   color: '#fff',
                   padding: '8px 16px',
                   borderRadius: '8px',
                   border: 'none',
                   cursor: 'pointer'
                 }}
               >
                 OK
               </button>
             </div>
           </div>
         </div>
       )}

      {/* Local toasts for OrderForm (right side) */}
      {localToasts.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 4000
        }}>
          {localToasts.map(t => (
            <div key={t.id} className="toast-card" style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              minWidth: '300px',
              maxWidth: '460px',
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: '#ffffff',
              border: '1px solid #EEE',
              boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
              color: '#111',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '6px',
                background: t.variant === 'error'
                  ? 'linear-gradient(180deg, #e11d2e 0%, #b3121c 100%)'
                  : 'linear-gradient(180deg, #1aa851 0%, #0f7f3a 100%)'
              }} />

              <div style={{
                width: '10px',
                height: '10px',
                marginTop: '4px',
                borderRadius: '50%',
                backgroundColor: t.variant === 'error' ? '#e11d2e' : '#1aa851'
              }} />

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#374151' }}>{t.message}</div>
              </div>

              <button
                className="toast-close"
                onClick={() => {
                  setLocalToasts(prev => {
                    const removed = prev.find(x => x.id === t.id);
                    if (removed && typeof removed.onClose === 'function') {
                      try { removed.onClose(); } catch (err) { console.error(err); }
                    }
                    return prev.filter(x => x.id !== t.id);
                  });
                }}
                aria-label="Dismiss notification"
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  color: '6b7280',
                  fontSize: '16px',
                  lineHeight: 1,
                  padding: '4px',
                  position: 'absolute',
                  top: '8px',
                  right: '10px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
     </div>
   </div>
 );
};

const PreviewPage = ({ savedImages, onModify, onConfirm, onClose }) => {
  return (
<div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px'
}}>
  <div
    style={{
      padding: '30px',
      borderRadius: '8px',
      maxWidth: '1000px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      background: 'transparent'
    }}
  >
    {/* 👇 Blurred Background */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '8px',
        backgroundImage: `url('/dots-perspective-with-blank-space-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(1.3px)',
        zIndex: 0,
      }}
    />

    {/* 👇 Foreground Content */}
    <div style={{ position: 'relative', zIndex: 1 }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          width: '30px',
          height: '30px',
          borderRadius: '20%',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#fff',
          backgroundColor: '#dd052b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ×
      </button>

      <h2 style={{
        textAlign: 'center',
        marginTop: 0,
        marginBottom: '20px',
        color: 'rgba(255, 255, 255, 1)'
      }}>
        Personalisation Preview
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginBottom: '10px', color: '#ffffffff' }}>Front Row</h4>
          <div style={{ width: '420px', height: '320px', border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            {savedImages['Front Row'] ? (
              <img src={savedImages['Front Row']} alt="Front Row Saved" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No image saved</div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginBottom: '10px', color: '#ffffffff' }}>Rear Row</h4>
          <div style={{ width: '420px', height: '320px', border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            {savedImages['Rear Row'] ? (
              <img src={savedImages['Rear Row']} alt="Rear Row Saved" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No image saved</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button className="custom-button sliding-fill" onClick={onModify}>Modify</button>
        <button className="custom-button sliding-fill" onClick={onConfirm}>Confirm Personalisation</button>
      </div>
    </div>
  </div>
</div>


  );
};

const App = () => {
 const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
 const [selectedSeatView, setSelectedSeatView] = useState('Front Row');
 const [selectedAccessory, setSelectedAccessory] = useState('');
 const [personalisedContent, setPersonalisedContent] = useState('');
 const [selectedFont, setSelectedFont] = useState('Arial');
 const [selectedColor, setSelectedColor] = useState(textColors[0].value);
 const [numSets, setNumSets] = useState(1);
 const imageRef = useRef(null);
 const [isMobile, setIsMobile] = useState(false);
 const [showPopup, setShowPopup] = useState(false);
 const [showSuccessPopup, setShowSuccessPopup] = useState(false);
 const [downloadedFileName, setDownloadedFileName] = useState('');
 const [isImageLoading, setIsImageLoading] = useState(false);
 const [isAdjustMode, setIsAdjustMode] = useState(false);
 const [adjustablePositions, setAdjustablePositions] = useState([]);
 const [fontsLoaded, setFontsLoaded] = useState(false);
 const [showOrderForm, setShowOrderForm] = useState(false);
 const [previewImage, setPreviewImage] = useState('');
 const orderFormRef = useRef(null);
 const [savedImages, setSavedImages] = useState({});
 const [lastEditedRow, setLastEditedRow] = useState('Front Row');
 const [isPreviewOpen, setIsPreviewOpen] = useState(false);
 const [isNextHovered, setIsNextHovered] = useState(false);
 const [isSaveHovered, setIsSaveHovered] = useState(false);
 const [toasts, setToasts] = useState([]);
 const [primarySeatView, setPrimarySeatView] = useState(null);
 const [actionPopup, setActionPopup] = useState({ open: false, message: '' });
 const [forceFlowAfterModify, setForceFlowAfterModify] = useState(false);
 const [loadingText, setLoadingText] = useState('');

 useEffect(() => {
   loadFonts().then(() => {
     setFontsLoaded(true);
   });

   const style = document.createElement('style');
   style.textContent = extraStyles;
   document.head.appendChild(style);

   const handleResize = () => {
     setIsMobile(window.innerWidth <= 768);
   };
   handleResize();
   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);

 useEffect(() => {
   if (selectedVehicleModel && selectedAccessory && selectedSeatView) {
     const positions = textPositions[selectedVehicleModel]?.[selectedSeatView]?.[selectedAccessory] || [];
     setAdjustablePositions([...positions]);
   }
 }, [selectedVehicleModel, selectedAccessory, selectedSeatView]);

 const getImagePath = () => {
   if (!selectedVehicleModel || !selectedAccessory || !selectedSeatView) {
     return '/The new Mahindra Logo has been unveiled.png';
   }
   
   return `/models/${selectedVehicleModel}/${selectedSeatView}/${selectedAccessory}.png`;
 };

 const handleDownload = async () => {
   if (!selectedVehicleModel || !selectedAccessory || !selectedSeatView) {
     setShowPopup(true);
     return;
   }

   const element = imageRef.current;
   if (!element) return;

   try {
     setIsImageLoading(true);
     
     const canvas = await html2canvas(element, {
       scale: 4,
       useCORS: true,
       allowTaint: true,
       backgroundColor: null
     });
     
     const imgWidth = canvas.width;
     const imgHeight = canvas.height;
     
     const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
     const pdf = new jsPDF(orientation, 'mm', 'a4');
     
     const pageWidth = pdf.internal.pageSize.getWidth();
     const pageHeight = pdf.internal.pageSize.getHeight();
     
     const margin = 10;
     const availableWidth = pageWidth - (2 * margin);
     const availableHeight = pageHeight - (2 * margin);
     
     const ratio = Math.min(
       availableWidth / imgWidth,
       availableHeight / imgHeight
     );
     
     const scaledWidth = imgWidth * ratio;
     const scaledHeight = imgHeight * ratio;
     
     const x = (pageWidth - scaledWidth) / 2;
     const y = (pageHeight - scaledHeight) / 2;
     
     pdf.addImage(
       canvas.toDataURL('image/jpeg', 0.95),
       'JPEG',
       x,
       y,
       scaledWidth,
       scaledHeight
     );
     
     const vehicle = selectedVehicleModel || 'vehicle';
     const accessory = selectedAccessory || 'accessory';
     const seat = selectedSeatView === 'Front Row' ? 'front' : 'rear';
     
     const cleanFilename = `${vehicle}-${seat}-${accessory}`
       .trim()
       .replace(/\s+/g, '-')
       .replace(/[^a-zA-Z0-9\-]/g, '')
       .toLowerCase();
     
     setDownloadedFileName(`${cleanFilename}.pdf`);
     pdf.save(`${cleanFilename}.pdf`);
     
     setIsImageLoading(false);
     setShowSuccessPopup(true);
     setTimeout(() => {
       setShowSuccessPopup(false);
     }, 3000);
     
   } catch (error) {
     console.error("Error generating PDF:", error);
     setIsImageLoading(false);
     
     try {
       const canvas = await html2canvas(element, { scale: 2 });
       const link = document.createElement('a');
       const vehicle = selectedVehicleModel || 'vehicle';
       const accessory = selectedAccessory || 'accessory';
       const seat = selectedSeatView === 'Front Row' ? 'front' : 'rear';
       
       const cleanFilename = `${vehicle}-${seat}-${accessory}`
         .trim()
         .replace(/\s+/g, '-')
         .replace(/[^a-zA-Z0-9\-]/g, '')
         .toLowerCase();
       
       link.download = `${cleanFilename}.jpg`;
       link.href = canvas.toDataURL('image/jpeg', 0.95);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       
       setDownloadedFileName(`${cleanFilename}.jpg`);
       setShowSuccessPopup(true);
       setTimeout(() => setShowSuccessPopup(false), 3000);
     } catch (fallbackError) {
       console.error("Fallback error:", fallbackError);
       alert("Failed to generate download. Please try again.");
     }
   }
 };

 const handleSave = async () => {
   if (!selectedVehicleModel || !selectedAccessory || !selectedSeatView || !personalisedContent) {
     setShowPopup(true);
     return;
   }
 
   const element = imageRef.current;
   if (!element) return;
 
   try {
     const canvas = await html2canvas(element, {
       scale: 2,
       useCORS: true,
       allowTaint: true,
       backgroundColor: null
     });
     const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
     setSavedImages(prev => ({ ...prev, [selectedSeatView]: dataUrl }));
     setLastEditedRow(selectedSeatView);
     if (!primarySeatView) {
       setPrimarySeatView(selectedSeatView);
     }
     pushToast(`${selectedSeatView} saved successfully`, 'success');
   } catch (error) {
     console.error('Error saving design:', error);
     pushToast('Failed to save the current design. Please try again.', 'error');
   }
 };

 const isBothSaved = Boolean(savedImages['Front Row'] && savedImages['Rear Row']);
 const getOppositeRow = (row) => (row === 'Front Row' ? 'Rear Row' : 'Front Row');

 const handleContinue = () => {
   if (isBothSaved) {
     setIsPreviewOpen(true);
     return;
   }
   setSelectedSeatView(prev => getOppositeRow(prev));
 };

 const handlePrimaryButtonClick = () => {
   const isSecondaryRow = Boolean(primarySeatView && selectedSeatView !== primarySeatView);
   const isCurrentRowSaved = Boolean(savedImages[selectedSeatView]);
 
   if (isBothSaved && !forceFlowAfterModify) {
     setIsPreviewOpen(true);
     setForceFlowAfterModify(false);
     return;
   }
 
   const nextRow = getOppositeRow(selectedSeatView);
   if (!isCurrentRowSaved) {
     const targetLabel = isSecondaryRow ? 'Preview' : `move to ${nextRow}`;
     setActionPopup({
       open: true,
       message: `Please save the personalisation for ${selectedSeatView} before you ${targetLabel}.`
     });
     return;
   }
 
   // Default behavior: move to the other row
   setSelectedSeatView(prev => getOppositeRow(prev));
 };

 const handlePreviewClick = async () => {
  // Only check for required fields before allowing preview
  if (
    !selectedVehicleModel ||
    !selectedAccessory ||
    !personalisedContent.trim() ||
    !selectedColor
  ) {
    setActionPopup({
      open: true,
      message: 'Please personalise your Comfort Kit to view the Preview.'
    });
    return;
  }

  // Show loading spinner and loading text while generating images
  setIsImageLoading(true);
  setLoadingText('Generating preview images, please wait...');

  // Save both images for preview using previewTextPositions
  const saveImageForRow = async (row) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '500px';
    container.style.height = '390px';
    container.style.background = '#fff';
    document.body.appendChild(container);

    // Add image
    const img = document.createElement('img');
    img.src = `/models/${selectedVehicleModel}/${row}/${selectedAccessory}.png`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    container.appendChild(img);

    await new Promise(resolve => img.onload = resolve);

    // Use previewTextPositions for embroidery overlays
    const positions = previewTextPositions[selectedVehicleModel]?.[row]?.[selectedAccessory] || [];
    positions.forEach(position => {
      const textEl = document.createElement('div');
      textEl.textContent = personalisedContent;
      textEl.style.position = 'absolute';
      textEl.style.top = position.top;
      textEl.style.left = position.left;
      textEl.style.transform = `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`;
      textEl.style.fontFamily = selectedFont;
      textEl.style.fontSize = `${position.fontSize?.desktop || 14}px`;
      textEl.style.color = selectedColor;
      textEl.style.fontStyle = 'italic';
      textEl.style.fontWeight = 'bold';
      textEl.style.WebkitTextStroke = '0.3px rgba(68, 68, 68, 0.5)';
      textEl.style.textShadow = `1px 1px 1px rgba(33, 33, 33, 0.28), -1px -1px 1px rgba(71, 71, 71, 0.56), 0 0 2px rgba(37, 36, 36, 0.3)`;
      textEl.style.pointerEvents = 'none';
      textEl.style.whiteSpace = 'nowrap';
      textEl.style.zIndex = '10';
      container.appendChild(textEl);
    });

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    });

    document.body.removeChild(container);
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  // Generate both images in parallel
  const [frontImage, rearImage] = await Promise.all([
    saveImageForRow('Front Row'),
    saveImageForRow('Rear Row')
  ]);

  setSavedImages({
    'Front Row': frontImage,
    'Rear Row': rearImage
  });

  setIsImageLoading(false);
  setLoadingText('');
  setIsPreviewOpen(true);
 };

 const handleShareOrder = async () => {
   if (!orderFormRef.current) return;
   
   try {
     const canvas = await html2canvas(orderFormRef.current, {
       scale: 3,
       useCORS: true,
       allowTaint: true,
       backgroundColor: null
     });
     
     const image = canvas.toDataURL('image/jpeg', 0.9);
     
     if (navigator.share) {
       const blob = await fetch(image).then(res => res.blob());
       const file = new File([blob], 'order.jpg', { type: 'image/jpeg' });
       
       await navigator.share({
         title: 'Mahindra Order Details',
         text: 'Check out my Mahindra personalized accessory order',
         files: [file]
       });
     } else {
       const link = document.createElement('a');
       link.href = image;
       link.download = 'order-preview.jpg';
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
     }
   } catch (error) {
     console.error("Error sharing order:", error);
   }
 };

 const dataURLtoBlob = (dataURL) => {
   const arr = dataURL.split(',');
   const mime = arr[0].match(/:(.*?);/)[1];
   const bstr = atob(arr[1]);
   let n = bstr.length;
   const u8arr = new Uint8Array(n);
   while (n--) {
     u8arr[n] = bstr.charCodeAt(n);
   }
   return new Blob([u8arr], { type: mime });
 };

 const pushToast = (message, variant = 'success', timeoutMs = 2500) => {
   const id = Date.now() + Math.random();
   setToasts(prev => [...prev, { id, message, variant }]);
   window.setTimeout(() => {
     setToasts(prev => prev.filter(t => t.id !== id));
   }, timeoutMs);
 };

 const updatePosition = (index, property, value) => {
   const newPositions = [...adjustablePositions];
   newPositions[index] = {
     ...newPositions[index],
     [property]: value
   };
   setAdjustablePositions(newPositions);
 };

 const handleRowChange = (value) => {
   if (!primarySeatView) {
     setPrimarySeatView(value);
   }
   setSelectedSeatView(value);
 };

 const preloadSelectedFont = () => {
   if (!selectedFont) return null;
   
   return (
     <div 
       style={{ 
         fontFamily: selectedFont, 
         fontStyle: 'italic',
         position: 'absolute', 
         visibility: 'hidden', 
         fontSize: '22px'
       }}
     >
       {personalisedContent || "Preload Text"}
     </div>
   );
 };

 if (showOrderForm) {
  return (
    <OrderForm 
      onClose={() => {
        setShowOrderForm(false);
        setIsPreviewOpen(true); // Go back to Preview page when closing OrderForm
      }}
      onDownload={handleDownload}
      onShare={handleShareOrder}
      selectedVehicleModel={selectedVehicleModel}
      selectedSeatView={selectedSeatView}
      selectedAccessory={selectedAccessory}
      personalisedContent={personalisedContent}
      selectedFont={selectedFont}
      selectedColor={selectedColor}
      numSets={numSets}
      previewImage={previewImage}
      pushToast={pushToast}
    />
  );
 }

 if (isPreviewOpen) {
   return (
     <PreviewPage
       savedImages={savedImages}
       onModify={() => {
         setIsPreviewOpen(false);
         if (primarySeatView) {
           setSelectedSeatView(primarySeatView);
         } else {
           setSelectedSeatView(lastEditedRow);
         }
         setForceFlowAfterModify(true);
       }}
       onConfirm={() => {
         setIsPreviewOpen(false);
         setShowOrderForm(true);
       }}
       onClose={() => setIsPreviewOpen(false)}
     />
   );
 }

 return (
   <div className="app-container">
     {preloadSelectedFont()}
     
     <div className="left-panel">
       <h3 style={{ fontFamily: '"Exo 2", sans-serif' }}>PERSONALISED COMFORT KIT</h3>
       <p style={{ fontFamily: '"Exo 2", sans-serif', marginTop: '-20px' }}>
         Showcase your unique style by personalizing your accessory with elegantly embroidered lettering in your preferred font.
       </p>

       {/* Vehicle Model */}
       <label style={{ fontFamily: '"Exo 2", sans-serif', color: Boolean(primarySeatView) ? '#888' : 'inherit' }}>Vehicle Model</label>
       <select
         value={selectedVehicleModel}
         onChange={e => setSelectedVehicleModel(e.target.value)}
         disabled={Boolean(primarySeatView)}
         style={{ fontFamily: '"Exo 2", sans-serif', opacity: Boolean(primarySeatView) ? 0.6 : 1 }}
       >
         <option value="" disabled style={{ fontFamily: '"Exo 2", sans-serif' }}>
           Select a Vehicle Model
         </option>
         {vehicleModels.map(model => (
           <option key={model} value={model} style={{ fontFamily: '"Exo 2", sans-serif' }}>
             {model}
           </option>
         ))}
       </select>

       {/* REMOVED: Select Row dropdown */}

       {/* Kit Type */}
       <label style={{ fontFamily: '"Exo 2", sans-serif', color: (primarySeatView && selectedSeatView !== primarySeatView) ? '#888' : 'inherit' }}>Kit Type</label>
       <select
         value={selectedAccessory}
         onChange={e => setSelectedAccessory(e.target.value)}
         disabled={!selectedVehicleModel || (primarySeatView && selectedSeatView !== primarySeatView)}
         style={{ fontFamily: '"Exo 2", sans-serif', opacity: (primarySeatView && selectedSeatView !== primarySeatView) ? 0.6 : 1 }}
       >
         <option value="" disabled style={{ fontFamily: '"Exo 2", sans-serif' }}>
           Select an Accessory
         </option>
         {accessories.map(acc => (
           <option key={acc} value={acc} style={{ fontFamily: '"Exo 2", sans-serif' }}>
             {acc}
           </option>
         ))}
       </select>

       {/* Personalised Content */}
       <label style={{ fontFamily: '"Exo 2", sans-serif', color: (primarySeatView && selectedSeatView !== primarySeatView) ? '#888' : 'inherit' }}>Personalised Content</label>
       <input
         type="text"
         maxLength={7}
         value={personalisedContent}
         onChange={e => setPersonalisedContent(e.target.value)}
         disabled={primarySeatView && selectedSeatView !== primarySeatView}
         style={{ fontFamily: selectedFont, opacity: (primarySeatView && selectedSeatView !== primarySeatView) ? 0.6 : 1 }}
       />

       {/* Font Style */}
       <label style={{ fontFamily: '"Exo 2", sans-serif', color: (primarySeatView && selectedSeatView !== primarySeatView) ? '#888' : 'inherit' }}>Font Style</label>
       <select
         value={selectedFont}
         onChange={e => setSelectedFont(e.target.value)}
         disabled={primarySeatView && selectedSeatView !== primarySeatView}
         style={{ fontFamily: selectedFont || '"Exo 2", sans-serif', opacity: (primarySeatView && selectedSeatView !== primarySeatView) ? 0.6 : 1 }}
       >
         <option value="" disabled style={{ fontFamily: '"Exo 2", sans-serif' }}>
           Select a Font Style
         </option>
         {fontStyles.map(font => (
           <option key={font} value={font} style={{ fontFamily: font, fontStyle: 'italic' }}>
             {font}
           </option>
         ))}
       </select>

       {/* Text Color */}
       <label style={{ fontFamily: '"Exo 2", sans-serif' }}>Select Text Color</label>
       <div className="color-palette">
         {textColors.map(color => (
           <div
             key={color.value}
             className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`}
             style={{
               backgroundColor: color.value,
               width: '25px',
               height: '25px',
               borderRadius: '50%',
               margin: '8px 5px 5px 0',
               cursor: 'pointer',
               display: 'inline-block',
               border: selectedColor === color.value ? '2px solid black' : '1px solid #ddd'
             }}
             onClick={() => setSelectedColor(color.value)}
             title={color.name}
           />
         ))}
       </div>

       {/* No. of Sets and Price */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ flex: 1 }}>
    <label style={{ fontFamily: '"Exo 2", sans-serif' }}>No. of Sets</label>
    <div style={{ position: 'relative', width: '100px' }}>
      <input
        type="number"
        min={1}
        value={numSets}
        onChange={e => setNumSets(Math.max(1, parseInt(e.target.value) || 1))}
        className="no-spinner"
        style={{
          width: '100%',
          padding: '5px 25px',
          textAlign: 'center',
          MozAppearance: 'textfield',
          fontFamily: '"Exo 2", sans-serif',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '5px',
          top: '55%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontFamily: '"Exo 2", sans-serif',
        }}
        onClick={() => setNumSets(prev => Math.max(1, prev - 1))}
      >
        −
      </span>
      <span
        style={{
          position: 'absolute',
          right: '-47px',
          top: '55%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontFamily: '"Exo 2", sans-serif',
        }}
        onClick={() => setNumSets(prev => prev + 1)}
      >
        +
      </span>
    </div>
  </div>

  {/* Price Display */}
<div style={{ flex: 1, textAlign: 'right', marginTop: '20px' }}>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    }}
  >
    {/* Top row: MRP and Value */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <label
        style={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 'bold',
          color: '#ec891f', // red like Amazon
        }}
      >
        MRP:
      </label>

      <div
        style={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 'bold',
          color: '#ffffff',
          fontSize: '18px',
        }}
      >
        {selectedAccessory
          ? `₹${(
              parseInt(kitPrices[selectedAccessory].replace(/[^\d]/g, '')) *
              numSets
            ).toLocaleString()}`
          : '--/--'}
      </div>
    </div>

    {/* Below value: Inclusive text */}
    {selectedAccessory && (
      <div
        style={{
          fontFamily: '"Exo 2", sans-serif',
          fontSize: '12px',
          color: '#ccc',
          marginTop: '2px',
        }}
      >
        (Inclusive of all taxes)
      </div>
    )}
  </div>
</div>






</div>


       {/* Buttons */}
       <div className="button-group" style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'center' }}>
         <button
           className="custom-button sliding-fill"
           onClick={handlePreviewClick}
           title="Preview both rows"
         >
           Preview
         </button>
       </div>
     </div>

     <div className="right-panel">
       <div className="image-container" ref={imageRef} style={{ position: 'relative' }}>
         {isImageLoading && (
           <div className="image-loader" style={{
             position: 'absolute',
             top: 0, left: 0, right: 0, bottom: 0,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             background: 'rgba(255,255,255,0.7)',
             zIndex: 100
           }}>
             <img src="/spinning-dots.svg" alt="Loading..." style={{ width: 60, height: 60 }} />
             <div style={{ marginTop: '16px', color: '#005d8f', fontWeight: 'bold', fontSize: '18px' }}>
               {loadingText}
             </div>
           </div>
         )}

         <img
           src={getImagePath()}
           alt="Accessory Preview"
           className="headrest-image"
           style={{ marginTop:'8%', width: '100%', height: 'auto', display: isImageLoading ? 'none' : 'block' }}
           onLoad={() => setIsImageLoading(false)}
           onError={() => setIsImageLoading(false)}
           onLoadStart={() => setIsImageLoading(true)}
         />

         {personalisedContent && selectedVehicleModel && selectedAccessory && selectedSeatView && fontsLoaded && (
           <>
             {(isAdjustMode ? adjustablePositions : textPositions[selectedVehicleModel]?.[selectedSeatView]?.[selectedAccessory] || []).map((position, index) => (
               position ? (
                 <EmbroideredText
                   key={`${index}-${selectedColor}-${selectedFont}`}
                   text={personalisedContent}
                   fontFamily={selectedFont}
                   position={position}
                   textColor={selectedColor}
                   isMobile={isMobile}
                 />
               ) : null
             ))}
           </>
         )}
       </div>

       {/* Row Switch Buttons - Only show when both vehicle model and kit type are selected */}
      {(selectedVehicleModel && selectedAccessory) && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '18px', justifyContent: 'center' }}>
          <button
            style={{
              flex: 1,
              background: selectedSeatView === 'Front Row' ? '#005d8f' : '#fff',
              color: selectedSeatView === 'Front Row' ? '#fff' : '#003366',
              border: selectedSeatView === 'Front Row' ? 'none' : '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '10px 0',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: selectedSeatView === 'Front Row' ? 'default' : 'pointer',
              boxShadow: selectedSeatView === 'Front Row' ? '0 2px 8px rgba(0,93,143,0.08)' : 'none',
              transition: 'background 0.2s, color 0.2s'
            }}
            disabled={selectedSeatView === 'Front Row'}
            onClick={() => setSelectedSeatView('Front Row')}
          >
            Front Row
          </button>
          <button
            style={{
              flex: 1,
              background: selectedSeatView === 'Rear Row' ? '#005d8f' : '#fff',
              color: selectedSeatView === 'Rear Row' ? '#fff' : '#003366',
              border: selectedSeatView === 'Rear Row' ? 'none' : '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '10px 0',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: selectedSeatView === 'Rear Row' ? 'default' : 'pointer',
              boxShadow: selectedSeatView === 'Rear Row' ? '0 2px 8px rgba(0,93,143,0.08)' : 'none',
              transition: 'background 0.2s, color 0.2s'
            }}
            disabled={selectedSeatView === 'Rear Row'}
            onClick={() => setSelectedSeatView('Rear Row')}
          >
            Rear Row
          </button>
        </div>
      )}
    </div>

    {showSuccessPopup && (
       <div className="popup-overlay">
         <div className="popup-box success-popup">
           <div className="success-icon">✓</div>
           <p>Your PDF "{downloadedFileName}" has been downloaded successfully!</p>
           <button onClick={() => setShowSuccessPopup(false)}>OK</button>
         </div>
       </div>
     )}

     {showPopup && (
       <div className="popup-overlay">
         <div className="popup-box">
           <p>Please select Vehicle Model, Seat Row, and Accessory and Personalised Content before Saving</p>
           <button onClick={() => setShowPopup(false)}>OK</button>
         </div>
       </div>
     )}

     {actionPopup.open && (
       <div className="popup-overlay">
         <div className="popup-box">
           <p>{actionPopup.message}</p>
           <button onClick={() => setActionPopup({ open: false, message: '' })}>OK</button>
         </div>
       </div>
     )}

     {/* Toasts */}
     {toasts.length > 0 && (
       <div style={{
         position: 'fixed',
         top: '20px',
         right: '20px',
         display: 'flex',
         flexDirection: 'column',
         gap: '12px',
         zIndex: 3000
       }}>
         {toasts.map(t => (
           <div key={t.id} className="toast-card" style={{
             display: 'flex',
             alignItems: 'flex-start',
             gap: '12px',
             minWidth: '300px',
             maxWidth: '460px',
             padding: '14px 16px',
             borderRadius: '14px',
             backgroundColor: '#ffffff',
             border: '1px solid #EEE',
             boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
             color: '#111',
             position: 'relative',
             overflow: 'hidden'
           }}>
             {/* Accent gradient bar */}
             <div style={{
               position: 'absolute',
               left: 0,
               top: 0,
               bottom: 0,
               width: '6px',
               background: t.variant === 'error' 
                 ? 'linear-gradient(180deg, #e11d2e 0%, #b3121c 100%)'
                 : 'linear-gradient(180deg, #1aa851 0%, #0f7f3a 100%)'
             }} />

             {/* Status dot */}
             <div style={{
               width: '10px',
               height: '10px',
               marginTop: '4px',
               borderRadius: '50%',
               backgroundColor: t.variant === 'error' ? '#e11d2e' : '#1aa851'
             }} />

             <div style={{ flex: 1 }}>
               <div style={{ fontSize: '13px', color: '#374151' }}>{t.message}</div>
             </div>

             <button
               className="toast-close"
               onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
               aria-label="Dismiss notification"
               style={{
                 cursor: 'pointer',
                 border: 'none',
                 background: 'transparent',
                 color: '6b7280',
                 fontSize: '16px',
                 lineHeight: 1,
                 padding: '4px',
                 position: 'absolute',
                 top: '8px',
                 right: '10px'
               }}
             >
               ×
             </button>
           </div>
         ))}
       </div>
     )}
   </div>
 );
};

export default App;