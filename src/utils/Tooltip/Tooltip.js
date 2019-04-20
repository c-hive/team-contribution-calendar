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

  tooltipDOMElement.style.display = 'block';
  tooltipDOMElement.style.top = `${rectCoordinates.top - 40}px`;
  tooltipDOMElement.style.left = `${rectCoordinates.left - (tooltipDOMElement.clientWidth / 2)}px`;
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
