import * as GetStyledCalendarElement from '../GetStyledCalendarElement/GetStyledCalendarElement';

const showTooltip = (event) => {
  const hoveredDay = event.target;

  const contributions = Number(hoveredDay.getAttribute('data-count'));
  const date = hoveredDay.getAttribute('data-date');

  const tooltipElement = document.getElementById('tooltip');

  const tooltipInnerText = GetStyledCalendarElement.contributionsWithDateText(
    contributions, date,
  );

  tooltipElement.appendChild(tooltipInnerText);

  const hoveredDayPositionAttributes = hoveredDay.getBoundingClientRect();

  tooltipElement.style.display = 'block';
  tooltipElement.style.top = `${hoveredDayPositionAttributes.top - 35}px`;
  tooltipElement.style.left = `${hoveredDayPositionAttributes.left - (tooltipElement.clientWidth / 2)}px`;
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
