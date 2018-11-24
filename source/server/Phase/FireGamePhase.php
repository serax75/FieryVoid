<?php

class FireGamePhase implements Phase
{
    public function advance(TacGamedata $gameData, DBManager $dbManager)
    {
        //print("start end");

        $gameData->setPhase(4);
        $gameData->setActiveship(-1);

        $dbManager->updateGamedata($gameData);

        $servergamedata = $dbManager->getTacGamedata($gameData->forPlayer, $gameData->id);
        Firing::prepareFiring($servergamedata); //Marcin Sawicki, October 2017: new approach: calculate base hit chance first!
        Firing::automateIntercept($servergamedata);
        Firing::fireWeapons($servergamedata);
        Criticals::setCriticals($servergamedata);

        $dbManager->submitFireorders($servergamedata->id, $servergamedata->getNewFireOrders(), $servergamedata->turn, 3);
        $dbManager->updateFireOrders($servergamedata->getUpdatedFireOrders());

        $dbManager->submitDamages($servergamedata->id, $servergamedata->turn, $servergamedata->getNewDamages());

        // check if adaptive Armour events did happen and submit
        $damagesAA = $servergamedata->getNewDamagesForAA();

        if ($damagesAA) {
            foreach ($damagesAA as $entry) {
                $dbManager->submitDamagesForAdaptiveArmour($servergamedata->id, $servergamedata->turn, $entry);
            }
        }

        // submit criticals
        $dbManager->submitCriticals($servergamedata->id, $servergamedata->getUpdatedCriticals(), $servergamedata->turn);
        $dbManager->setPlayersWaitingStatusInGame($servergamedata->id, false);
    }

    public function process(TacGamedata $gameData, DBManager $dbManager, array $ships)
    {
        foreach ($ships as $ship) {
            if ($ship->userid != $gameData->forPlayer) {
                continue;
            }

            if ($ship->isDestroyed()) {
                continue;
            }

            if (Firing::validateFireOrders($ship->getAllFireOrders(), $gameData)) {
                $dbManager->submitFireorders($gameData->id, $ship->getAllFireOrders(), $gameData->turn, $gameData->phase);
            }

        }

        $dbManager->updatePlayerStatus($gameData->id, $gameData->forPlayer, $gameData->phase, $gameData->turn);
        $dbManager->setPlayerWaitingStatus($gameData->forPlayer, $gameData->id, true);

        return true;
    }
}
