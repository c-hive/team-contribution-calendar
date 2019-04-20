import * as GetStyledCalendarElement from '../GetStyledCalendarElement/GetStyledCalendarElement';

const showTooltip = (event) => {
  const hoveredRectElement = event.target;

  const contributions = Number(hoveredRectElement.getAttribute('data-count'));
  const date = hoveredRectElement.getAttribute('data-date');
  const rectCoordinates = hoveredRectElement.getBoundingClientRect();

  const tooltipDOMElement = document.getElementById('tooltip');

  const tooltipText = GetStyledCalendarElement.contributionsWithDateText(
    contributions, date,
  );

  tooltipDOMElement.appendChild(tooltipText);

  const toopltipTopPosition = `${rectCoordinates.top - 40}px`;
  const tooltipLeftPosition = `${rectCoordinates.left - (tooltipDOMElement.clientWidth / 2)}px`;

  tooltipDOMElement.style.display = 'block';
  tooltipDOMElement.style.top = toopltipTopPosition;
  tooltipDOMElement.style.left = tooltipLeftPosition;
};

const hideTooltip = () => {
  const tooltipDOMElement = document.getElementById('tooltip');

  if (tooltipDOMElement.childNodes.length === 0) {
    return;
  }

  tooltipDOMElement.style.display = 'none';
  tooltipDOMElement.style.top = '0px';
  tooltipDOMElement.style.left = '0px;';

  tooltipDOMElement.removeChild(tooltipDOMElement.childNodes[0]);
};

export const addEvents = () => {
  const rectElements = document.getElementsByTagName('rect');
  const rects = Array.from(rectElements);

  rects.forEach((rect) => {
    rect.addEventListener('mouseenter', showTooltip);
    rect.addEventListener('mouseleave', hideTooltip);
  });
};
