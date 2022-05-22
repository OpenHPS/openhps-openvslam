import { DataObject, Service } from '@openhps/core';
import { Config, System } from '../openvslam';

/**
 * Visual SLAM service for managing running systems
 */
export class VSLAMService extends Service {
    protected globalSystemUID: string;
    protected systems: Map<string, System> = new Map();
    protected objectSystemsMap: Map<string, string> = new Map();
    protected systemObjectsMap: Map<string, string[]> = new Map();
    protected options: VSLAMServiceOptions;

    constructor(options?: VSLAMServiceOptions) {
        super();
        this.options = options;
    }

    /**
     * Create a new OpenVSLAM system
     *
     * @param {string} config Configuration YAML file
     * @param {DataObject} [object] Optional data object
     * @returns {Promise<string>} Promise of the system UID
     */
    createSystem(configFile: string, object?: DataObject): Promise<string> {
        return new Promise((resolve) => {
            const uid = this.generateUUID();
            const config = new Config(configFile);
            const system = new System(config, this.options.vocabularyFile);
            this.systems.set(uid, system);
            if (object) {
                this.objectSystemsMap.set(object.uid, uid);
                const objects = this.systemObjectsMap.get(uid) ?? [];
                objects.push(object.uid);
                this.systemObjectsMap.set(uid, objects);
            } else {
                this.globalSystemUID = uid;
            }
            resolve(uid);
        });
    }

    /**
     * Delete an OpenVSLAM system
     * 
     * @param {string} systemUID System UID to delete
     * @returns {Promise<void>} Promise of system deletion
     */
    deleteSystem(systemUID: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findSystemByUID(systemUID).then(system => {
                // Shutdown the system
                system.shutdown();
                this.systems.delete(systemUID);
                const objectUIDs = this.systemObjectsMap.get(systemUID);
                this.systemObjectsMap.delete(systemUID);
                objectUIDs.forEach(uid => {
                    this.objectSystemsMap.delete(uid);
                });
                if (systemUID === this.globalSystemUID) {
                    this.globalSystemUID === undefined;
                }
                resolve();
            }).catch(reject);
        });
    }

    /**
     * Find the global system
     * 
     * @returns {Promise<System>} Promise of the global system
     */
    findGlobalSystem(): Promise<System> {
        return this.findSystemByUID(this.globalSystemUID);
    }

    /**
     * Find a system by its UID
     *
     * @param {string} uid Unique Identifier 
     * @returns {Promise<System>} Promise of a system
     */
    findSystemByUID(uid: string): Promise<System> {
        return new Promise((resolve) => {
            const system = this.systems.get(uid);
            return resolve(system);
        });
    }
    /**
     * Find a system uid by an object
     *
     * @param {DataObject} object Data object to get system for
     * @returns {Promise<string>} Promise of a system uid if found
     */
     findSystemUIDByObject(object: DataObject): Promise<string> {
        return new Promise((resolve) => {
            const systemUID = this.objectSystemsMap.get(object.uid);
            if (!systemUID) {
                return resolve(this.globalSystemUID);
            }
            return resolve(systemUID);
        });
    }

    /**
     * Find a system by an object
     *
     * @param {DataObject} object Data object to get system for
     * @returns {Promise<System>} Promise of a system if found
     */
    findSystemByObject(object: DataObject): Promise<System> {
        const systemUID = this.objectSystemsMap.get(object.uid);
        if (!systemUID) {
            return this.findGlobalSystem();
        }
        return this.findSystemByUID(systemUID);
    }
}

export interface VSLAMServiceOptions {
    /**
     * ORB vocabulary file path
     */
    vocabularyFile: string;
}