import express from 'express';
import territoriesService from '../services/territories.service';
import debug, { IDebugger } from 'debug';
import availableLocales from 'cldr-core/availableLocales.json';
import rootData from 'cldr-localenames-modern/main/root/territories.json';

const log: IDebugger = debug('app:territories-controller');

const modernLocales = availableLocales.availableLocales.modern;
const availableTags = Object.keys(rootData.main.root.localeDisplayNames.territories);

export const availableFilters: string[] = [
  'tag',
  'displayName',
  'altDisplayNames',
  'languages',
  'gdp',
  'population',
  'literacyPercent',
  'parentTerritories',
  'contains',
  'languages',
  'currencies'
];

class TerritoriesController {

  constructor() {
    log('Created new instance of TerritoriesController');
  }

  async listTerritories(req: express.Request, res: express.Response) {
    let { 
      limit = 25, 
      page = 1,
      tags = availableTags,
      locales = modernLocales,
      filters = availableFilters
    } = req.query;

    if (typeof tags === 'string') {
      tags = tags.split(',');
    } else {
      tags = availableTags as string[];
    }

    if (typeof locales === 'string') {
      locales = locales.split(',');
    } else {
      locales = modernLocales as string[];
    }

    if (typeof filters === 'string') {
      filters = filters.split(',');
    } else {
      filters = availableFilters as string[];
    }
    
    limit = parseInt(limit as string, 10);
    page = parseInt(page as string, 10);

    if (isNaN(limit) || isNaN(page)) {
      res.status(400).send();
    }

    const territories = await territoriesService.list(tags, locales, filters, limit, page);
    res.status(200).send({territories: territories});
  }

  async createTerritory(req: express.Request, res: express.Response) {
    const id = await territoriesService.create(req.body);
    res.status(201).send({ _id: id});
  }

  async getTerritoryById(req: express.Request, res: express.Response) {
    const territory = await territoriesService.getById(req.params.id);
    if (!territory) {
      res.status(404).send();
    }
    res.status(200).send(territory);
  }

  async updateTerritoryById(req: express.Request, res: express.Response) {
    log(await territoriesService.updateById(req.params.id, req.body));
    res.status(204).send();
  }

  async removeTerritoryById(req: express.Request, res: express.Response) {
    log(await territoriesService.removeById(req.params.id));
    res.status(204).send();
  }

  async listTerritoriesByTagOrType(req: express.Request, res: express.Response) {
    const tag = req.params.tag;

    let { 
      limit = 25, 
      page = 1,
      locales = modernLocales,
      filters = availableFilters
    } = req.query;

    if (typeof locales === 'string') {
      locales = locales.split(',');
    } else {
      locales = modernLocales as string[];
    }

    if (typeof filters === 'string') {
      filters = filters.split(',');
    } else {
      filters = availableFilters as string[];
    }
    
    limit = parseInt(limit as string, 10);
    page = parseInt(page as string, 10);

    if (isNaN(limit) || isNaN(page)) {
      res.status(400).send();
    }

    const territories = await territoriesService.listByNameOrType(tag, locales, filters, limit, page);
    res.status(200).send({territories: territories});
  }
}

export default new TerritoriesController()