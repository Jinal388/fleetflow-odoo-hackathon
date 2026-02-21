"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchController = void 0;
const dispatch_service_1 = require("../../services/dispatch.service");
const api_response_utility_1 = require("../../utils/api.response.utility");
class DispatchController {
    static async createDispatch(req, res) {
        try {
            const dispatch = await dispatch_service_1.DispatchService.createDispatch({
                ...req.body,
                createdBy: req.user.userId,
            });
            return api_response_utility_1.ApiResponse.created(res, dispatch, 'Dispatch created successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async getAllDispatches(req, res) {
        try {
            const dispatches = await dispatch_service_1.DispatchService.getAllDispatches(req.query);
            return api_response_utility_1.ApiResponse.success(res, dispatches);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async getDispatchById(req, res) {
        try {
            const dispatch = await dispatch_service_1.DispatchService.getDispatchById(req.params.id);
            if (!dispatch)
                return api_response_utility_1.ApiResponse.notFound(res, 'Dispatch not found');
            return api_response_utility_1.ApiResponse.success(res, dispatch);
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.error(res, error.message);
        }
    }
    static async approveDispatch(req, res) {
        try {
            const dispatch = await dispatch_service_1.DispatchService.approveDispatch(req.params.id, req.user.userId);
            return api_response_utility_1.ApiResponse.success(res, dispatch, 'Dispatch approved successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async startDispatch(req, res) {
        try {
            const dispatch = await dispatch_service_1.DispatchService.startDispatch(req.params.id);
            return api_response_utility_1.ApiResponse.success(res, dispatch, 'Dispatch started successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async completeDispatch(req, res) {
        try {
            const dispatch = await dispatch_service_1.DispatchService.completeDispatch(req.params.id);
            return api_response_utility_1.ApiResponse.success(res, dispatch, 'Dispatch completed successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
    static async cancelDispatch(req, res) {
        try {
            const dispatch = await dispatch_service_1.DispatchService.cancelDispatch(req.params.id);
            return api_response_utility_1.ApiResponse.success(res, dispatch, 'Dispatch cancelled successfully');
        }
        catch (error) {
            return api_response_utility_1.ApiResponse.badRequest(res, error.message);
        }
    }
}
exports.DispatchController = DispatchController;
//# sourceMappingURL=dispatch.controller.js.map