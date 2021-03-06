// Copyright 2018 Unknwon. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

package main

import (
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	log "gopkg.in/clog.v1"

	"github.com/Unknwon/Project-Spartan/haproxy/pkg/registry"

	"github.com/Unknwon/Project-Spartan/cpanel/pkg/setting"
)

var haproxyRegistry, serverRegistry, databaseRegistry *registry.Registry
var dbCoons = map[string]*gorm.DB{}

// newDBConn tries to connect to a database with given information and returns the connection.
func newDBConn(in *registry.Instance) (*gorm.DB, error) {
	sec := setting.Config.Section("database." + in.Name)
	return gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/rportal", sec.Key("USER"), sec.Key("PASSWORD"), in.Address))
}

func init() {
	healthCheckClient = &http.Client{
		Timeout: setting.HealthCheck.Timeout,
	}
	haproxyRegistry = registry.NewRegistry(setting.HAProxy.EndPoints)
	serverRegistry = registry.NewRegistry(setting.Server.EndPoints)
	databaseRegistry = registry.NewRegistry(setting.Database.EndPoints)

	// Setup database connections
	for _, in := range databaseRegistry.Instances {
		x, err := newDBConn(in)
		if err != nil {
			log.Warn("Failed to open database connection for '%s': %v", in.Name, err)
			in.Status = registry.STATUS_DOWN
			continue
		}
		dbCoons[in.Name] = x
	}

	go HealthCheck()
}

var healthCheckClient *http.Client
var healthCheckCount int64 = 1

func sendHealthCheckRequest(in *registry.Instance) bool {
	resp, err := healthCheckClient.Get("http://" + in.Address + "/healthcheck")
	if err != nil {
		if _, ok := err.(net.Error); !ok {
			log.Error(2, "Failed to perform health check for '%s': %v", in, err)
		}
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Error(2, "Failed to perform health check for '%s': status code is %d not 200", in, resp.StatusCode)
		return false
	}
	return true
}

func HealthCheck() {
	log.Trace("[%d] Health check started...", healthCheckCount)

	for _, ins := range [][]*registry.Instance{
		haproxyRegistry.Instances,
		serverRegistry.Instances,
	} {
		for _, in := range ins {
			if sendHealthCheckRequest(in) {
				in.Status = registry.STATUS_RUNNING
			} else {
				in.Status = registry.STATUS_DOWN
			}
		}
	}

	// FIXME: Need to reconnect if the database was down last time, otherwise Ping will always fail.
	for _, in := range databaseRegistry.Instances {
		// Retry connect if previously failed
		if dbCoons[in.Name] == nil {
			x, err := newDBConn(in)
			if err != nil {
				log.Warn("Failed to open database connection for '%s': %v", in.Name, err)
				continue
			}
			dbCoons[in.Name] = x
		}

		// Note: For some reasons, GORM Ping cannot detect database down without a failed query.
		dbCoons[in.Name].HasTable("resellers")
		if err := dbCoons[in.Name].DB().Ping(); err != nil {
			log.Error(2, "Failed to perform health check for '%s': %v", in, err)
			dbCoons[in.Name] = nil
			in.Status = registry.STATUS_DOWN
		} else {
			in.Status = registry.STATUS_RUNNING
		}
	}

	time.AfterFunc(setting.HealthCheck.Interval, HealthCheck)
	log.Trace("[%d] Health check finished.", healthCheckCount)
	healthCheckCount++
}
