// controllers/incidentController.js
import { Incident, Chantier } from "../models/relation.js";
import Assignment from "../models/Assignment.js";
import { validationResult } from 'express-validator';
import { Op } from "sequelize";

// récupérer tous les incidents avec pagination et filtres
export const getAllIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 10, chantierId, severity, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    
    if (chantierId) {
      whereConditions.chantierId = chantierId;
    }
    
    if (severity) {
      whereConditions.severity = severity;
    }
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (search) {
      whereConditions.title = { [Op.like]: `%${search}%` };
    }

    // Si l'utilisateur n'est pas admin, seulement les incidents de ses chantiers
    if (!req.user.Roles.some(role => role.nom === 'admin')) {
      const userAssignments = await Assignment.findAll({
        where: { 
          userId: req.user.id,
          isActive: true 
        },
        attributes: ['chantierId']
      });
      
      const chantierIds = userAssignments.map(a => a.chantierId);
      whereConditions.chantierId = { [Op.in]: chantierIds };
    }

    const { count, rows: incidents } = await Incident.findAndCountAll({
      where: whereConditions,
      include: [
        {
          association: 'Chantier',
          attributes: ['id', 'nom', 'adresse']
        },
        {
          association: 'Reporter',
          attributes: ['id', 'nom', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.status(200).json({
      data: incidents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// déclarer un incident
export const declareIncident = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chantierId, title, description, severity, date, photo } = req.body;

    // Vérifier si le chantier existe
    const chantier = await Chantier.findByPk(chantierId);
    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    // Vérifier si l'utilisateur est assigné au chantier
    const assignment = await Assignment.findOne({
      where: { 
        userId: req.user.id, 
        chantierId,
        isActive: true 
      }
    });

    if (!assignment && !req.user.Roles.some(role => role.nom === 'admin')) {
      return res.status(403).json({ message: "Vous n'êtes pas assigné à ce chantier" });
    }

    const incident = await Incident.create({
      chantierId,
      reportedBy: req.user.id,
      title,
      description,
      severity: severity || 'mineur',
      status: 'ouvert',
      date: date || new Date(),
      photo
    });

    res.status(201).json({ 
      data: incident, 
      message: "Incident déclaré avec succès" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// récupérer un incident par son id
export const getIncidentById = async (req, res) => {
  const { id } = req.params;
  try {
    const incident = await Incident.findByPk(id, {
      include: [
        {
          association: 'Chantier',
          attributes: ['id', 'nom', 'adresse']
        },
        {
          association: 'Reporter',
          attributes: ['id', 'nom', 'email']
        }
      ]
    });
    
    if (!incident) {
      return res.status(404).json({ message: "Incident non trouvé" });
    }

    // Vérifier les permissions
    if (!req.user.Roles.some(role => role.nom === 'admin')) {
      const assignment = await Assignment.findOne({
        where: { 
          userId: req.user.id, 
          chantierId: incident.chantierId,
          isActive: true 
        }
      });

      if (!assignment) {
        return res.status(403).json({ message: "Accès non autorisé à cet incident" });
      }
    }

    res.status(200).json({ data: incident });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// modifier un incident
export const updateIncident = async (req, res) => {
  const { id } = req.params;
  const { title, description, severity, date, photo } = req.body;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incident = await Incident.findByPk(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident non trouvé" });
    }

    // Vérifier si l'utilisateur est le déclarant ou un admin/superviseur
    const isDeclarant = incident.reportedBy === req.user.id;
    const isAdminOrSupervisor = req.user.Roles.some(role => 
      role.nom === 'admin' || role.nom === 'superviseur'
    );

    if (!isDeclarant && !isAdminOrSupervisor) {
      return res.status(403).json({ message: "Permissions insuffisantes" });
    }

    await incident.update({
      title: title || incident.title,
      description: description || incident.description,
      severity: severity || incident.severity,
      date: date || incident.date,
      photo: photo || incident.photo
    });

    res.status(200).json({ 
      message: "Incident modifié avec succès",
      data: incident
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// supprimer un incident
export const deleteIncident = async (req, res) => {
  const { id } = req.params;
  try {
    const incident = await Incident.findByPk(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident non trouvé" });
    }

    await Incident.destroy({ where: { id } });
    res.status(200).json({ message: "Incident supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// classer la gravité d'un incident
export const updateIncidentSeverity = async (req, res) => {
  const { id } = req.params;
  const { severity } = req.body;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incident = await Incident.findByPk(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident non trouvé" });
    }

    await incident.update({ severity });

    res.status(200).json({ 
      message: "Gravité de l'incident mise à jour avec succès",
      data: incident
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// mettre à jour le statut d'un incident
export const updateIncidentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const incident = await Incident.findByPk(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident non trouvé" });
    }

    await incident.update({ status });

    res.status(200).json({ 
      message: "Statut de l'incident mis à jour avec succès",
      data: incident
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// marquer un incident comme résolu
export const markIncidentAsResolved = async (req, res) => {
  const { id } = req.params;
  
  try {
    const incident = await Incident.findByPk(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident non trouvé" });
    }

    await incident.update({ status: 'résolu' });

    res.status(200).json({ 
      message: "Incident marqué comme résolu avec succès",
      data: incident
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// récupérer les statistiques des incidents
export const getIncidentStats = async (req, res) => {
  try {
    const { chantierId } = req.query;

    const whereConditions = {};
    if (chantierId) {
      whereConditions.chantierId = chantierId;
    }

    // Si l'utilisateur n'est pas admin, seulement les incidents de ses chantiers
    if (!req.user.Roles.some(role => role.nom === 'admin')) {
      const userAssignments = await Assignment.findAll({
        where: { 
          userId: req.user.id,
          isActive: true 
        },
        attributes: ['chantierId']
      });
      
      const chantierIds = userAssignments.map(a => a.chantierId);
      whereConditions.chantierId = { [sequelize.Op.in]: chantierIds };
    }

    const incidents = await Incident.findAll({
      where: whereConditions,
      attributes: ['severity', 'status']
    });

    const stats = {
      total: incidents.length,
      parGravite: {
        mineur: incidents.filter(i => i.severity === 'mineur').length,
        modéré: incidents.filter(i => i.severity === 'modéré').length,
        critique: incidents.filter(i => i.severity === 'critique').length
      },
      parStatut: {
        ouvert: incidents.filter(i => i.status === 'ouvert').length,
        en_cours: incidents.filter(i => i.status === 'en_cours').length,
        résolu: incidents.filter(i => i.status === 'résolu').length
      },
      tauxResolution: incidents.length > 0 
        ? (incidents.filter(i => i.status === 'résolu').length / incidents.length * 100).toFixed(1)
        : 0
    };

    res.status(200).json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};