import React, { useState, useEffect } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import HeaderInput from '../HeaderInput';
import { HttpMethods, StatusCodes } from '../../utils/consts';
import { updateRoute as updateRouteRequest, createNewRoute } from '../../utils/routes-api';
import faker from 'faker';
import uuid from 'uuid/v4';

const HTTP_METHOD_LIST = [
  HttpMethods.GET,
  HttpMethods.POST,
  HttpMethods.PUT,
  HttpMethods.PATCH,
  HttpMethods.DELETE
];

const STATUS_CODES = [
  StatusCodes.OK,
  StatusCodes.CREATED,
  StatusCodes.ACCEPTED,
  StatusCodes.NO_CONTENT,
  StatusCodes.BAD_REQUEST,
  StatusCodes.UNAUTHORIZED,
  StatusCodes.FORBIDDEN,
  StatusCodes.NOT_FOUND,
  StatusCodes.CONFLICT,
  StatusCodes.UNPROCESSABLE_ENTITY,
  StatusCodes.INTERNAL_SERVER_ERROR,
  StatusCodes.SERVICE_UNAVAILABLE,
  StatusCodes.GATEWAY_TIMEOUT
];

const Modal = function (props) {
  const { onClose = () => {}, route: editedRoute } = props;

  const [route, updateRoute] = useState(editedRoute.route || '');
  const [httpMethod, updateHttpMethod] = useState(editedRoute.httpMethod || '');
  const [statusCode, updateStatusCode] = useState(editedRoute.statusCode || '');
  const [delay, updateDelay] = useState(editedRoute.delay || '0');
  const [payload, updatePayload] = useState(editedRoute.payload || {});
  const [disabled, updateDisabled] = useState(editedRoute.disabled || false);
  const [headers, updateHeaders] = useState(editedRoute.headers || []);
  const [conditions, updateConditions] = useState(editedRoute.conditions || []);
  const [proxyUrl, updateProxyUrl] = useState(editedRoute.proxyUrl || '');

  const isNewRoute = editedRoute.id === undefined;

  const modalTitle = isNewRoute ? 'Add Route' : 'Edit Route';

  const setHeader = (updatedHeader) => {
    const { id } = updatedHeader;
    const updatedHeaders = headers.map((header) =>
      id !== header.id ? header : { ...header, ...updatedHeader }
    );
    updateHeaders(updatedHeaders);
  };

  const addNewHeader = () => updateHeaders([...headers, { id: uuid(), header: '', value: '' }]);
  const removeHeader = (headerId) => updateHeaders(headers.filter(({ id }) => id !== headerId));

  const addNewCondition = () => updateConditions([...conditions, { id: uuid(), condition: '', responses: [{ id: uuid(), statusCode: '', body: {} }] }]);
  const removeCondition = (conditionId) => updateConditions(conditions.filter(({ id }) => id !== conditionId));

  const updateResponse = (conditionId, responseId, newResponse) => {
    const updatedConditions = conditions.map((condition) => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          responses: condition.responses.map((response) =>
            response.id === responseId ? { ...response, ...newResponse } : response
          )
        };
      }
      return condition;
    });
    updateConditions(updatedConditions);
  };

  const removeResponseFromCondition = (conditionId, responseId) => {
    const updatedConditions = conditions.map((condition) => {
      if (condition.id === conditionId) {
        return {
          ...condition,
          responses: condition.responses.filter((response) => response.id !== responseId)
        };
      }
      return condition;
    });
    updateConditions(updatedConditions);
  };

  const saveChanges = async () => {
    try {
      const cleanedHeaders = headers.filter(({ header, value }) => header !== '' && value !== '');
      const cleanedConditions = conditions.filter(({ condition }) => condition !== '');
      const data = {
        ...editedRoute,
        route,
        httpMethod,
        statusCode,
        delay,
        payload,
        disabled,
        headers: cleanedHeaders,
        conditions: cleanedConditions,
        proxyUrl
      };
      isNewRoute ? await createNewRoute(data) : await updateRouteRequest(data);
      onClose(); // Close the modal after saving
    } catch (error) {
      console.log('Error', error);
    }
  };

  const statusCodeStartingWith = (startingNumber) => STATUS_CODES.filter((routeStatusCode) => routeStatusCode.startsWith(startingNumber));

  return (
    <div className="modal is-active" data-testid="route-modal">
      <div className="modal-background animated fadeIn faster" />
      <div className="modal-card animated fadeInDown faster">
        <header className="modal-card-head">
          <p className="modal-card-title">{modalTitle}</p>
          <button className="delete" aria-label="close" onClick={onClose} />
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label htmlFor="route-name" className="label">
              Route
            </label>
            <div className="control has-icons-left">
              <input
                aria-label="route-name"
                className="input"
                type="text"
                placeholder="Text input"
                value={route.replace('/', '')}
                onChange={(e) => updateRoute(`/${e.currentTarget.value}`)}
              />
              <span className="icon is-small is-left">/</span>
            </div>
          </div>
          <div className="field-body">
            <div className="field">
              <label htmlFor="route-http" className="label">
                HTTP Method
              </label>
              <div className="control">
                <div className="select">
                  <select
                    aria-label="route-http"
                    value={httpMethod}
                    onChange={(e) => updateHttpMethod(e.currentTarget.value)}
                  >
                    {HTTP_METHOD_LIST.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Status Code</label>
              <div className="control">
                <div className="select">
                  <select
                    aria-label="route-statuscode"
                    value={statusCode}
                    onChange={(e) => updateStatusCode(e.currentTarget.value)}
                  >
                    <optgroup aria-label="2xx" label="2xx">
                      {statusCodeStartingWith('2').map((routeStatusCode) => (
                        <option key={routeStatusCode} value={routeStatusCode}>
                          {routeStatusCode}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup aria-label="4xx" label="4xx">
                      {statusCodeStartingWith('4').map((routeStatusCode) => (
                        <option key={routeStatusCode} value={routeStatusCode}>
                          {routeStatusCode}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup aria-label="5xx" label="5xx">
                      {statusCodeStartingWith('5').map((routeStatusCode) => (
                        <option key={routeStatusCode} value={routeStatusCode}>
                          {routeStatusCode}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Delay </label>
              <div className="control">
                <div className="select">
                  <select
                    aria-label="route-delay"
                    value={delay}
                    onChange={(e) => updateDelay(e.currentTarget.value)}
                  >
                    <option value="0">0</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                    <option value="1500">1500</option>
                    <option value="2000">2000</option>
                    <option value="5000">5000</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="field mt10">
            <label className="label">Response</label>
            <div className="control">
              <JSONInput
                placeholder={payload || {}}
                onChange={(e) => updatePayload(e.jsObject)}
                height="120px"
                width="100%"
                locale="en-gb"
              />
              <a
                className="button is-small is-pulled-right random-data is-primary is-inverted"
                onClick={() => updatePayload(faker.helpers.userCard())}
                aria-label="route-randomly-generate-data"
              >
                Randomly Generate Data
              </a>
            </div>
          </div>
          <hr />
          <div className="field mt10">
            <label className="label" aria-label="no-headers-message">
              Response Headers (optional)
            </label>
            {headers.length === 0 && <i>No headers added.</i>}
            {headers.map((header) => (
              <HeaderInput
                key={header.id}
                data={header}
                onBlur={setHeader}
                onRemove={removeHeader}
              />
            ))}
            <button
              aria-label="add-header"
              className="button is-small is-primary"
              onClick={addNewHeader}
            >
              Add Header
            </button>
          </div>
          <hr />
          <div className="field mt10">
            <label className="label">Conditions</label>
            <div className="control">
              {conditions.length === 0 && <i>No conditions added.</i>}
              {conditions.map((condition) => (
                <div key={condition.id} className="field mt10">
                  <div className="control">
                    <div className="field">
                      <label className="label">Condition</label>
                      <input
                        aria-label="condition"
                        className="input"
                        type="text"
                        value={condition.condition}
                        onChange={(e) =>
                          updateConditions(
                            conditions.map((c) =>
                              c.id === condition.id
                                ? { ...c, condition: e.currentTarget.value }
                                : c
                            )
                          )
                        }
                      />
                    </div>
                    {condition.responses.map((response) => (
                      <div key={response.id} className="field mt10">
                        <label className="label">Response</label>
                        <div className="control">
                          <div className="field">
                            <label className="label">Status Code</label>
                            <div className="control">
                              <div className="select">
                                <select
                                  aria-label="condition-response-statuscode"
                                  value={response.statusCode || ''}
                                  onChange={(e) =>
                                    updateResponse(condition.id, response.id, {
                                      statusCode: e.currentTarget.value
                                    })
                                  }
                                >
                                  {STATUS_CODES.map((statusCode) => (
                                    <option key={statusCode} value={statusCode}>
                                      {statusCode}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="field">
                            <label className="label">Response Body</label>
                            <JSONInput
                              placeholder={response.body || {}}
                              onChange={(e) =>
                                updateResponse(condition.id, response.id, {
                                  body: e.jsObject
                                })
                              }
                              height="120px"
                              width="100%"
                              locale="en-gb"
                            />
                          </div>
                          <button
                            className="button is-danger is-small mt5"
                            onClick={() => removeResponseFromCondition(condition.id, response.id)}
                          >
                            Remove Response
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      aria-label="add-response"
                      className="button is-small is-primary mt5"
                      onClick={() => updateConditions(
                        conditions.map((c) =>
                          c.id === condition.id
                            ? {
                                ...c,
                                responses: [
                                  ...c.responses,
                                  { id: uuid(), statusCode: '', body: {} }
                                ]
                              }
                            : c
                        )
                      )}
                    >
                      Add Response
                    </button>
                    <button
                      className="button is-danger is-small mt5"
                      onClick={() => removeCondition(condition.id)}
                    >
                      Remove Condition
                    </button>
                  </div>
                </div>
              ))}
              <button
                aria-label="add-condition"
                className="button is-small is-primary"
                onClick={addNewCondition}
              >
                Add Condition
              </button>
            </div>
          </div>
          <hr />
          <div className="field mt10">
            <label className="label">Proxy URL (optional)</label>
            <input
              aria-label="proxy-url"
              className="input"
              type="text"
              value={proxyUrl}
              onChange={(e) => updateProxyUrl(e.currentTarget.value)}
            />
          </div>
          <hr />
          <div className="field mt10">
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(e) => updateDisabled(e.currentTarget.checked)}
                />
                Disabled
              </label>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            aria-label="save-route"
            className="button is-primary"
            onClick={saveChanges}
          >
            Save changes
          </button>
          <button
            aria-label="cancel-route"
            className="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
